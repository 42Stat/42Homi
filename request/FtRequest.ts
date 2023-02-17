export abstract class FtRequest {
  protected ftApiUrl = "https://api.intra.42.fr/v2/";

  abstract sendRequest(token: string): Promise<Response>;
  abstract validate(response: Response): Promise<void>;
  abstract saveToFile(): Promise<void>;
  abstract saveToDB(): Promise<void>;

  constructor() {}

  public async getDataAndSaveToFile(token: string) {
    try {
      const response = await this.sendRequest(token);
      this.validate(response);
      this.saveToFile();
    } catch (error) {}
  }

  public async getDataAndSaveToDB(token: string) {
    try {
      const response = await this.sendRequest(token);
      this.validate(response);
      this.saveToDB();
    } catch (error) {}
  }
}
