import * as dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: "./.env.42app" });

console.log(process.env.AH);
console.log(process.env.AH2);
