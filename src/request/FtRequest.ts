import { logger } from "../..";

export abstract class FtRequest<T> {
  protected ftApiUrl = "https://api.intra.42.fr/v2/";
  protected retryCount = 0;

  abstract sendRequest(token: string): Promise<any>;
  abstract validate(response: any): Promise<T>;
  abstract saveToFile(data: T): Promise<void>;
  abstract saveToDB(data: T): Promise<void>;

  constructor() {}

  public getRetryCount(): number {
    return this.retryCount;
  }

  public async getDataAndSaveToFile(token: string): Promise<boolean> {
    try {
      let isEndPage = false;
      const data = await this.sendRequest(token);
      console.log(data.id);
      await this.saveToFile(await this.validate(data));

      if (Array.isArray(data) && data.length === 0) isEndPage = true;
      return isEndPage;
    } catch (error) {
      this.retryCount++;
      logger.log("error", error);
      throw this;
    }
  }

  public async getDataAndSaveToDB(token: string) {
    try {
      const data = await this.sendRequest(token);

      await this.saveToDB(await this.validate(data));
    } catch (error) {}
  }
}
