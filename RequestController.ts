import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
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
  private readonly requestCountPerLoop =
    Number(process.env.API_APP_COUNT) *
    Number(process.env.REQUEST_COUNT_PER_APP);

  private requesterList: Requester[];

  constructor() {
    this.requesterList = [];
    const appCount = Number(process.env.API_APP_COUNT);
    for (let idx = 0; idx < appCount; idx++) {
      this.requesterList.push(new Requester(idx));
    }
  }

  private delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
    resource: number,
    queryString: string | null
  ): FtRequest {
    switch (resourseType) {
      case RESOURCE_TYPE.USER:
        return new FtUserRequest(resource);
      default:
        throw Error();
    }
  }

  private createRequests(
    resourseType: ResourceType,
    queryString: string | null = null,
    range: RangeType = 1
  ) {
    const requestQueue: FtRequest[] = [];
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

  public async getOne(resourseType: ResourceType, resource: Url) {}

  public async getAll(
    resourseType: ResourceType,
    filterMap: FilterMap | null = null,
    sortList: SortList | null = null,
    range: RangeType = 1
  ) {
    const queryString = this.getOptionQueryString(filterMap, sortList);
    // TODO: Implement Queue
    const requestQueue: FtRequest[] = [];
    const retryQueue: FtRequest[] = [];

    if (Array.isArray(range)) {
      const promises = [];
      requestQueue.push(
        ...this.createRequests(resourseType, queryString, range)
      );
      console.log(requestQueue);
      while (requestQueue.length > 0) {
        // 48개를 다 쓸 때까지 돈다. (apiAppCount개씩)
        const requests = requestQueue.splice(0, this.apiAppCount);
        for (const [index, requester] of this.requesterList.entries()) {
          const request = requests[index];
          if (request === undefined) break;
          console.log(index);
          promises.push(requester.sendRequest(request));
        }
        console.log(Date.now());
        // FIXME: 1초가 멈춰야 함
        await this.delay(this.delaySecPerRequest);
        console.log(Date.now());
      }
      await Promise.allSettled(promises).then((results) => {
        // TODO: 성공 및 실패 케이스 분기
        for (const result of results) {
          if (result.status === "fulfilled") {
          } else if (result.status === "rejected") {
            console.log("failed");
            retryQueue.push();
          }
        }
      });
    } else {
      let page = range;
      let isVisitedEndPage = false;

      const isAllRequestDone = () => {
        return (
          isVisitedEndPage &&
          requestQueue.length === 0 &&
          retryQueue.length === 0
        );
      };
      while (true) {
        // 48개를 여기서 넣어주고, 계속 돈다.
        requestQueue.push(
          ...this.createRequests(resourseType, queryString, page)
        );
        const promises = [];
        // TODO: 중복되는 코드 함수로 빼기(while문 내부가 아래 로직과 같음)
        while (requestQueue.length > 0) {
          // 48개를 다 쓸 때까지 돈다. (apiAppCount개씩)
          const requests = requestQueue.splice(0, this.apiAppCount);
          for (const [index, requester] of this.requesterList.entries()) {
            const request = requests[index];
            if (request === undefined) break;
            promises.push(requester.sendRequest(request));
          }
          await this.delay(this.delaySecPerRequest);
        }
        await Promise.allSettled(promises).then((results) => {
          // TODO: 성공 및 실패 케이스 분기
          for (const result of results) {
            if (result.status === "fulfilled") {
            } else if (result.status === "rejected") {
              retryQueue.push();
            }
          }
        });
        for (let idx = 0; idx < this.maxRetryCountPerRequest; idx++) {
          while (retryQueue.length > 0) {
            const requests = retryQueue.splice(0, this.apiAppCount);
            for (const [index, requester] of this.requesterList.entries()) {
              const request = requests[index];
              if (request === undefined) break;
              promises.push(requester.sendRequest(request));
            }
          }
          await Promise.allSettled(promises).then((results) => {});
        }

        if (isAllRequestDone()) break;
        page += this.requestCountPerLoop;
      }
    }
  }
}
