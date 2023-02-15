import * as dotenv from "dotenv";
import { TokenManager } from "./tokenManager";

dotenv.config({ path: "./env/.env" });
dotenv.config({ path: "./env/.42app.env" });

// console.log(process.env);
// console.log(process.env[`UID_${0}`]);

const func = async () => {
  const tokenManager = new TokenManager(0);
  console.log(await tokenManager.getToken());
  console.log(await tokenManager.getToken());
};

func();
