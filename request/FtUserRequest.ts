import { FtRequest } from "./FtRequest";

export class FtUserRequest extends FtRequest {
  async sendRequest(token: string): Promise<Response> {
    const response = await fetch(this.apiUrl + "users/dha", {
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
