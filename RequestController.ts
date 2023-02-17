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
    queryString = queryString.slice(0, -1);
    return queryString;
  }

  private createRequest(
    resourseType: ResourceType,
    resource: number,
    queryString: string
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
    range: RangeType,
    queryString: string
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
      if (range === 0) {
        // Get all entities
      } else {
        // Get entities from range
      }
    }
    return requestQueue;
  }

  public async getOne(resourseType: ResourceType, resource: Url) {}
  public async getAll(
    resourseType: ResourceType,
    range: RangeType = 0,
    filterMap: FilterMap | null = null,
    sortList: SortList | null = null
  ) {
    const queryString = this.getOptionQueryString(filterMap, sortList);
    const requestQueue = [];
  }
}
