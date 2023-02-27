import { createImportSpecifier } from "typescript";
import { logger } from "../";
import { FTCoalitionUserRequest } from "./request/FtCoalitionUserRequest";
import { FtRequest } from "./request/FtRequest";
import { FtUserRequest } from "./request/FtUserRequest";
import { Requester } from "./Requester";

export const RESOURCE_TYPE = {
  NONE: "none",
  USER: "user",
  ACHIEVEMENT: "achievement",
  TITLE: "title",
  SUBJECT: "subject",
  PROJECT: "project",
  COALITION: "coalition",
  COALITION_USER: "coalition_user",
  EVALUATION: "evaluation",
  SCORE: "score",
} as const;
export type Url = string;
export type ResourceType = typeof RESOURCE_TYPE[keyof typeof RESOURCE_TYPE];
export type RangeType = number | number[];
export type FilterMap = Map<string, string | number | boolean>;
export type SortList = string[];

export class RequestController {
  private readonly ftApiUrl = "https://api.intra.42.fr/v2/";
  private readonly apiAppCount = Number(process.env.API_APP_COUNT);
  private readonly maxRetryCountPerRequest = Number(
    process.env.MAX_RETRY_COUNT_PER_REQUEST
  );
  private readonly delaySecPerRequest = Number(
    process.env.DELAY_SEC_PER_REQUEST
  );
  private readonly requestCountPerLoop = Number(
    process.env.REQUEST_COUNT_PER_LOOP
  );

  private requesterList: Requester[];

  constructor() {
    this.requesterList = [];

    for (let idx = 0; idx < this.apiAppCount; idx++) {
      this.requesterList.push(new Requester(idx));
    }
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getOptionQueryString(
    filterMap: FilterMap | null,
    sortList: SortList | null
  ): string {
    let queryString = "?";
    if (filterMap !== null) {
      for (const [key, value] of filterMap)
        queryString += `filter[${key}]=${value}&`;
    }
    if (sortList !== null && sortList.length > 0) {
      queryString += `sort=${sortList.join(",")}&`;
    }
    queryString += `page[size]=${process.env.PAGE_SIZE}&page[number]=`;
    return queryString;
  }

  private createRequest(
    resourseType: ResourceType,
    entity: number,
    queryString: string | null,
    resource: Url = ""
  ): FtRequest<any> {
    switch (resourseType) {
      case RESOURCE_TYPE.USER:
        return new FtUserRequest(entity);
      case RESOURCE_TYPE.COALITION_USER:
        return new FTCoalitionUserRequest(entity, resource, queryString);
      default:
        throw Error();
    }
  }

  private createRequests(
    resourseType: ResourceType,
    queryString: string | null = null,
    range: RangeType = 1,
    resource: Url = ""
  ) {
    const requestQueue: FtRequest<any>[] = [];
    // TODO: Create request class
    if (Array.isArray(range)) {
      // Get specific entities
      for (const entity of range) {
        requestQueue.push(
          this.createRequest(resourseType, entity, queryString, resource)
        );
      }
    } else {
      // Get all entities
      for (let idx = range; idx < range + this.requestCountPerLoop; idx++) {
        requestQueue.push(
          this.createRequest(resourseType, idx, queryString, resource)
        );
      }
    }
    return requestQueue;
  }

  private async sendRequestsLoop(
    queue: FtRequest<any>[],
    promises: Promise<unknown>[]
  ) {
    interface RequestInfo {
      requester: Requester;
      request: FtRequest<any>;
      delay: number;
    }
    const requestInfoQueue: RequestInfo[] = [];
    let requestIndex = 0;
    let iterationCount = 0;
    while (requestInfoQueue.length < queue.length) {
      // Iterate all requesters(=API apps)
      for (const requester of this.requesterList) {
        const requestLimitPerSec = requester.getRequestLimitPerSec();
        for (let index = 0; index < requestLimitPerSec; index++) {
          if (requestIndex >= queue.length) break;
          console.log(
            "time: ",
            iterationCount * this.delaySecPerRequest * 1000,
            " iterate: ",
            iterationCount
          );
          requestInfoQueue.push({
            requester: requester,
            request: queue[requestIndex++],
            delay: iterationCount * this.delaySecPerRequest * 1000,
          });
        }
      }
      iterationCount++;
    }
    for (const requestInfo of requestInfoQueue) {
      const { requester, request, delay } = requestInfo;
      promises.push(requester.sendRequest(request, delay));
    }
    queue.splice(0, queue.length);
    return promises;
  }

  private async checkResponse(
    promises: Promise<unknown>[],
    queue: FtRequest<any>[]
  ) {
    let isVisitedEndPage = false;
    await Promise.allSettled(promises).then((results) => {
      for (const result of results) {
        if (result.status === "fulfilled") {
          if (result.value === true) isVisitedEndPage = true;
        } else if (result.status === "rejected") {
          console.log(result.reason);
          const request: FtRequest<unknown> = result.reason;
          console.log(request);
          if (request.getRetryCount() < this.maxRetryCountPerRequest) {
            queue.push(request);
            console.log("error", request);
          } else {
            // TODO: Logging failed request
            logger.log("warn", request);
          }
        }
      }
    });
    promises.splice(0, promises.length);
    await this.wait(1000);
    return isVisitedEndPage;
  }

  public async getOne(resourseType: ResourceType, resource: Url) {}

  public async getAll(
    resourseType: ResourceType,
    filterMap: FilterMap | null = null,
    sortList: SortList | null = null,
    range: RangeType = 1,
    resource: Url = ""
  ): Promise<void> {
    const queryString = this.getOptionQueryString(filterMap, sortList);
    // TODO: Implement Queue
    const requestQueue: FtRequest<any>[] = [];
    const retryQueue: FtRequest<any>[] = [];
    const promises: Promise<unknown>[] = [];
    let isVisitedEndPage = false;

    const sendAllRequestsInQueue = async () => {
      await this.sendRequestsLoop(requestQueue, promises);
      if ((await this.checkResponse(promises, retryQueue)) == true)
        isVisitedEndPage = true;

      console.log(promises);

      // Retry failed requests(MAX_RETRY_COUNT_PER_REQUEST is in .env)
      while (retryQueue.length > 0) {
        await this.sendRequestsLoop(retryQueue, promises);
        if ((await this.checkResponse(promises, retryQueue)) == true)
          isVisitedEndPage = true;
      }
    };

    if (Array.isArray(range)) {
      // When specific entities are provided
      // Put all requests in queue
      requestQueue.push(
        ...this.createRequests(resourseType, queryString, range, resource)
      );
      await sendAllRequestsInQueue();
    } else {
      // When page is provided
      let page = range;

      while (true) {
        console.log("page: " + page);
        await this.wait(100);
        // Put limited requests in queue(to find end page)
        requestQueue.push(
          ...this.createRequests(resourseType, queryString, page, resource)
        );
        await sendAllRequestsInQueue();

        if (isVisitedEndPage) break;
        page += this.requestCountPerLoop;
      }
    }
    return;
  }
}
