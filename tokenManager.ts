export class TokenManager {
  static readonly loginUrl: string = "https://api.intra.42.fr/oauth/token";
  static readonly maxRetryCount: number = 3;
  private readonly id: number;
  private readonly uid: string;
  private readonly secret: string;
  private token: string;

  constructor(id: number) {
    this.id = id;
    const uid = process.env[`UID_${id}`];
    const secret = process.env[`SECRET_${id}`];
    if (uid === undefined || secret === undefined) throw Error();
    this.uid = uid;
    this.secret = secret;
  }

  private async requestAccessToken(): Promise<string> {
    const response = await fetch(TokenManager.loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.uid,
        client_secret: this.secret,
      }),
    });

    if (response.ok === false) {
      const message = `Token request(id: ${this.id}) failed: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    const data = await response.json();
    if (data["access_token"] === undefined) {
      const message = `Token response(id: ${this.id}) has no token`;
      throw new Error(message);
    }

    const token: string = data.access_token;
    return token;
  }

  private async getAccessToken(): Promise<string> {
    for (let idx = 0; idx < TokenManager.maxRetryCount; idx++) {
      try {
        // If request failed, retry until maxRetryCount.
        const token = await this.requestAccessToken();
        return token;
      } catch {
        continue;
      }
    }
    throw new Error();
  }

  public async getToken(): Promise<string> {
    if (this.token === undefined) {
      try {
        this.token = await this.getAccessToken();
      } catch (error) {
        throw error;
      }
    }
    return this.token;
  }
}
