import { FtRequest } from "./FtRequest";

export class FtUserRequest extends FtRequest {
  async sendRequest(token: string): Promise<Response> {
    return new Response();
  }
  async validateResponse(response: Response): Promise<void> {}
  async saveToFile(): Promise<void> {}
  async saveToDB(): Promise<void> {}
}
