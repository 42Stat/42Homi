import { FtRequest } from "./request/FtRequest";
import { TokenManager } from "./TokenManager";

export class Requester {
  static readonly requestLimitPerHour = process.env.REQUEST_LIMIT_PER_HOUR;
  static readonly maxRetryCount: number = process.env
    .MAX_RETRY_COUNT_PER_REQUEST
    ? Number(process.env.MAX_RETRY_COUNT_PER_REQUEST)
    : 3;
  private tokenManager: TokenManager;
  private id: number;
  private requestCount: number;
  private lastRequestTime: number;

  constructor(id: number) {
    this.id = id;
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
    this.tokenManager = new TokenManager(id);
  }

  public async sendRequest(request: FtRequest) {
    try {
      await request.getDataAndSaveToFile(await this.tokenManager.getToken());
    } catch (error) {
      console.log(`Error(${this.id}): Send request failed`);
    }
  }
}
