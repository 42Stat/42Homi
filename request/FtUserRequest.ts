import { FtRequest } from "./FtRequest";

export class FtUserRequest extends FtRequest {
  constructor(resource: number, queryString: string = "") {
    super();
    this.ftApiUrl += `users/${resource}`;
  }

  async sendRequest(token: string): Promise<Response> {
    const response = await fetch(this.ftApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  async validate(response: Response): Promise<void> {}
  async saveToFile(): Promise<void> {}
  async saveToDB(): Promise<void> {}
}
