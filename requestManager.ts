import { TokenManager } from "./tokenManager";

export class RequestManager {
  static readonly requestLimitPerHour = process.env.REQUEST_LIMIT_PER_HOUR;
  private tokenManager: TokenManager;
  private requestCount: number;
  private lastRequestTime: number;

  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }
}
