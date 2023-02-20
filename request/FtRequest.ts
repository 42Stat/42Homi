import { Any } from "0g";

export abstract class FtRequest {
  protected ftApiUrl = "https://api.intra.42.fr/v2/";
  protected retryCount = 0;

  abstract sendRequest(token: string): Promise<any>;
  abstract validate(response: Response): Promise<void>;
  abstract saveToFile(): Promise<void>;
  abstract saveToDB(): Promise<void>;

  constructor() {}

  public getRetryCount(): number {
    return this.retryCount;
  }

  public async getDataAndSaveToFile(token: string): Promise<FtRequest | void> {
    try {
      const data = await this.sendRequest(token);
      console.log(data.id);
      this.validate(data);
      this.saveToFile();
    } catch (error) {
      this.retryCount++;
      throw this;
    }
  }

  public async getDataAndSaveToDB(token: string) {
    try {
      const data = await this.sendRequest(token);
      this.validate(data);
      this.saveToDB();
    } catch (error) {}
  }
}
