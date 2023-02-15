import { FtRequest } from "./request/FtRequest";
import { TokenManager } from "./TokenManager";

export class RequestManager {
  static readonly requestLimitPerHour = process.env.REQUEST_LIMIT_PER_HOUR;
  private tokenManager: TokenManager;
  private requestCount: number;
  private lastRequestTime: number;

  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }

  public async sendRequest(request: FtRequest) {
    try {
      await request.getDataAndSaveToFile(await this.tokenManager.getToken());
    } catch (error) {}
  }
}
