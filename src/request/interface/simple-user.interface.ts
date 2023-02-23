import { JSONSchemaType } from "ajv";
import {
  UserImage,
  UserImageDto,
  userImageSchema,
} from "./userimage.interface";
import Ajv from "ajv";
const ajv = new Ajv();

export interface SimpleUserDto {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  displayname: string;
  kind: string;
  image: UserImageDto;
  staff?: boolean;
  correction_point: number;
  wallet: number;
  alumni?: boolean;
  active?: boolean;
}

// export interface SimpleUser {
//   id: number;
//   email: string;
//   login: string;
//   firstName: string;
//   lastName: string;
//   displayname: string;
//   kind: string;
//   image: UserImage;
//   staff?: boolean;
//   correctionPoint: number;
//   wallet: number;
//   alumni?: boolean;
//   active?: boolean;
// }

export const simpleUserSchema: JSONSchemaType<SimpleUserDto> = {
  // $id: "simpleUser",
  type: "object",
  properties: {
    id: { type: "number" },
    email: { type: "string" },
    login: { type: "string" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    displayname: { type: "string" },
    kind: { type: "string" },
    image: userImageSchema,
    staff: { type: "boolean", nullable: true },
    correction_point: { type: "number" },
    wallet: { type: "number" },
    alumni: { type: "boolean", nullable: true },
    active: { type: "boolean", nullable: true },
  },
  required: [
    "id",
    "email",
    "login",
    "first_name",
    "last_name",
    "displayname",
    "kind",
    "image",
    "correction_point",
    "wallet",
  ],
  additionalProperties: true,
};

export const validateSimpleUser = ajv.compile(simpleUserSchema);
