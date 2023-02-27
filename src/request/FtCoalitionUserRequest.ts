import { FtRequest } from "./FtRequest";
import { validateSimpleUser } from "./interface/simple-user.interface";
import {
  validateCoalitionUser,
  validateCoalitionUsers,
} from "./interface/coalitions-user.interface";

export class FTCoalitionUserRequest<CoalitionUserDto> extends FtRequest<
  CoalitionUserDto
> {
  constructor(
    entity: number,
    resource: string,
    queryString: string | null = null
  ) {
    super();
    this.ftApiUrl += `coalitions/${resource}/users${queryString}${entity}`;
  }

  public async sendRequest(token: string): Promise<any> {
    try {
      const response = await fetch(this.ftApiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("sendRequestDone: ", this.ftApiUrl);
      if (!response.ok) {
        throw Error(response.status.toString());
      }
      return await response.json();
    } catch (error) {
      console.log("sendRequestError: ", this.ftApiUrl, error);
      throw error;
    }
  }
  public async validate(response: any): Promise<CoalitionUserDto> {
    validateCoalitionUsers(response);
    if (validateCoalitionUser.errors) {
      const errorsString = JSON.stringify(validateCoalitionUser.errors);
      console.log(errorsString);
      throw Error(errorsString);
    }
    return response;
  }
  public async saveToFile(data: CoalitionUserDto): Promise<void> {}
  public async saveToDB(data: CoalitionUserDto): Promise<void> {}
}
