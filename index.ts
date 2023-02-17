import * as dotenv from "dotenv";
import * as winston from "winston";
import { FtUserRequest } from "./request/FtUserRequest";
import { Requester } from "./Requester";

dotenv.config({ path: "./env/.env" });
dotenv.config({ path: "./env/.42app.env" });

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

const func = async () => {
  // const tokenManager = new TokenManager(0);
  // console.log(await tokenManager.getToken());
  // console.log(await tokenManager.getToken());
  const requestManager = new Requester(0);
  const ftUserRequest = new FtUserRequest();
  requestManager.sendRequest(ftUserRequest);
};

async function main() {
  func();
}

main();
