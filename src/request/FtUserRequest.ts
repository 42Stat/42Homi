import Ajv from "ajv";
import { FtRequest } from "./FtRequest";
import { validateUser } from "./interface/user.interface";

export class FtUserRequest<UserDto> extends FtRequest<UserDto> {
  constructor(entity: number, queryString: string = "") {
    super();
    this.ftApiUrl += `users/${entity}`;
  }

  async sendRequest(token: string): Promise<Response> {
    const response = await fetch(this.ftApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw Error(response.status.toString());
    }
    return await response.json();
  }

  async validate(response: any): Promise<UserDto> {
    validateUser(response);
    if (validateUser.errors) {
      const errorsString = JSON.stringify(validateUser.errors);
      console.log(errorsString);
      throw Error(errorsString);
    }
    return response;
  }

  async saveToFile(): Promise<void> {}
  async saveToDB(): Promise<void> {}
}
