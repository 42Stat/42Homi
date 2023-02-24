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

  private delay(ms: number) {
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
        return new FTCoalitionUserRequest(entity, resource);
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
          this.createRequest(resourseType, entity, queryString)
        );
      }
    } else {
      // Get all entities
      for (let idx = range; idx < range + this.requestCountPerLoop; idx++) {
        requestQueue.push(this.createRequest(resourseType, idx, queryString));
      }
    }
    return requestQueue;
  }

  private async sendRequestsLoop(
    queue: FtRequest<any>[],
    promises: Promise<unknown>[]
  ) {
    let requestIndex = 0;
    mainLoop: while (true) {
      for (const requester of this.requesterList) {
        // console.log(requester.getId());
        const requestLimitPerSec = requester.getRequestLimitPerSec();
        for (let index = 0; index < requestLimitPerSec; index++) {
          const request = queue[requestIndex++];
          if (request === undefined) break mainLoop;
          console.log("req: " + Date.now());
          promises.push(requester.sendRequest(request));
        }
      }
      await this.delay(this.delaySecPerRequest * 1000);
    }
    queue.splice(0, queue.length);
    return promises;
  }

  private async storeRejectedRequestsInRetryQueue(
    promises: Promise<unknown>[],
    queue: FtRequest<any>[]
  ) {
    await Promise.allSettled(promises).then((results) => {
      for (const result of results) {
        // console.log(result);
        if (result.status === "rejected") {
          const request = result.reason;
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

    const sendAllRequestsInQueue = async () => {
      await this.sendRequestsLoop(requestQueue, promises);
      await this.storeRejectedRequestsInRetryQueue(promises, retryQueue);

      // Retry failed requests(MAX_RETRY_COUNT_PER_REQUEST is in .env)
      while (retryQueue.length > 0) {
        await this.sendRequestsLoop(retryQueue, promises);
        await this.storeRejectedRequestsInRetryQueue(promises, retryQueue);
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
      let isVisitedEndPage = false;

      while (true) {
        console.log("page: " + page);
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
