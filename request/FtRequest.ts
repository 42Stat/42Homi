export abstract class FtRequest {
  abstract sendRequest(token: string): Promise<Response>;
  abstract validateResponse(response: Response): Promise<void>;
  abstract saveToFile(): Promise<void>;
  abstract saveToDB(): Promise<void>;

  public async getDataAndSaveToFile(token: string) {
    try {
      const response = await this.sendRequest(token);
      this.validateResponse(response);
      this.saveToFile();
    } catch (error) {}
  }

  public async getDataAndSaveToDB(token: string) {
    try {
      const response = await this.sendRequest(token);
      this.validateResponse(response);
      this.saveToDB();
    } catch (error) {}
  }
}
