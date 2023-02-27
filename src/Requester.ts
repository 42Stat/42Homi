import { logger } from "..";
import { FtRequest } from "./request/FtRequest";
import { TokenManager } from "./TokenManager";

export class Requester {
  static readonly maxRetryCount: number = process.env
    .MAX_RETRY_COUNT_PER_REQUEST
    ? Number(process.env.MAX_RETRY_COUNT_PER_REQUEST)
    : 3;

  private tokenManager: TokenManager;
  private id: number;
  private requestLimitPerHour: number;
  private requestLimitPerSec: number;
  private requestCount: number;
  private lastRequestTime: number;

  constructor(id: number) {
    this.id = id;
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
    this.tokenManager = new TokenManager(id);
    this.requestLimitPerHour = Number(
      process.env[`REQUEST_LIMIT_PER_HOUR_${id}`] ?? 1200
    );
    this.requestLimitPerSec = Number(
      process.env[`REQUEST_LIMIT_PER_SEC_${id}`] ?? 2
    );
  }

  private wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public getId(): number {
    return this.id;
  }

  public getRequestLimitPerSec(): number {
    return this.requestLimitPerSec;
  }

  public async sendRequest(
    request: FtRequest<any>,
    delay: number
  ): Promise<boolean> {
    await this.wait(delay);
    console.log(Date.now() + request.getFtApiUrl());
    try {
      const isVisitedEndPage = await request.getDataAndSaveToFile(
        await this.tokenManager.getToken()
      );
      return isVisitedEndPage;
    } catch (error) {
      throw error;
    }
  }
}
