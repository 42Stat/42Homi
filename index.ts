import * as dotenv from "dotenv";
import * as winston from "winston";
import { FtUserRequest } from "./src/request/FtUserRequest";
import { RequestController, RESOURCE_TYPE } from "./src/RequestController";
import { Requester } from "./src/Requester";

dotenv.config({ path: "./env/.env" });
dotenv.config({ path: "./env/.42app.env" });

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "retry.log",
      level: "warn",
    }),
    new winston.transports.File({
      filename: "info.log",
      level: "info",
    }),
  ],
});

const func = async () => {
  // const tokenManager = new TokenManager(0);
  // console.log(await tokenManager.getToken());
  // console.log(await tokenManager.getToken());
  const requestController = new RequestController();
  await requestController.getAll(
    RESOURCE_TYPE.USER,
    null,
    null,
    [99733, 99974, 100000]
  );
  await requestController.getAll(
    RESOURCE_TYPE.COALITION_USER,
    null,
    null,
    1,
    "85"
  );
  await requestController.getAll(
    RESOURCE_TYPE.COALITION_USER,
    null,
    null,
    1,
    "86"
  );
  await requestController.getAll(
    RESOURCE_TYPE.COALITION_USER,
    null,
    null,
    1,
    "87"
  );
  await requestController.getAll(
    RESOURCE_TYPE.COALITION_USER,
    null,
    null,
    1,
    "88"
  );
};

async function main() {
  await func();
}

main();
