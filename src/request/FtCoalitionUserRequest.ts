import { FtRequest } from "./FtRequest";

export class FTCoalitionUserRequest<
  CoalitionUserDto
> extends FtRequest<CoalitionUserDto> {
  constructor(resource: number) {
    super();
  }

  public async sendRequest(token: string): Promise<any> {}
  public async validate(response: any): Promise<CoalitionUserDto> {
    return response;
  }
  public async saveToFile(data: CoalitionUserDto): Promise<void> {}
  public async saveToDB(data: CoalitionUserDto): Promise<void> {}
}
