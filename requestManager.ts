import { FtRequest } from "./request/FtRequest";
import { TokenManager } from "./TokenManager";

export class RequestManager {
  static readonly requestLimitPerHour = process.env.REQUEST_LIMIT_PER_HOUR;
  private tokenManager: TokenManager;
  private id: number;
  private requestCount: number;
  private lastRequestTime: number;

  constructor(id: number) {
    this.tokenManager = new TokenManager(id);
  }

  public async sendRequest(request: FtRequest) {
    try {
      await request.getDataAndSaveToFile(await this.tokenManager.getToken());
    } catch (error) {}
  }
}
