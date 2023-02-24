import { FtRequest } from "./FtRequest";
import { validateSimpleUser } from "./interface/simple-user.interface";
import { validateCoalitionUser } from "./interface/coalitions-user.interface";

export class FTCoalitionUserRequest<
  CoalitionUserDto
> extends FtRequest<CoalitionUserDto> {
  constructor(entity: number, resource: string, queryString: string = "") {
    super();
    this.ftApiUrl += `coalitions/${entity}/users${queryString}${entity}`;
  }

  public async sendRequest(token: string): Promise<any> {
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
  public async validate(response: any): Promise<CoalitionUserDto> {
    validateCoalitionUser(response);
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
