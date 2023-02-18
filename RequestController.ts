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
      requestQueue.push(
        ...this.createRequests(resourseType, queryString, range)
      );
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
        while (requestQueue.length > 0) {
          // 48개를 다 쓸 때까지 돈다. (apiAppCount개씩)
          const requests = requestQueue.splice(0, this.apiAppCount);
          const promises = [];
          for (let idx = 0; idx < requests.length; idx += ) {
            const request = requests[idx];
            const requester = this.requesterList[idx];
            promises.push(requester.sendRequest(request));
          }
          Promise.allSettled(promises).then((results) => {});
        }

        if (isAllRequestDone()) break;
        page += this.requestCountPerLoop;
      }
    }
  }
}
