import { JSONSchemaType } from "ajv";

export interface UserImageDto {
  link?: string;
}

export interface UserImage {
  link?: string;
}

export const userImageSchema: JSONSchemaType<UserImage> = {
  // $id: "userImage",
  type: "object",
  properties: {
    link: { type: "string", nullable: true },
  },
  required: [],
  additionalProperties: true,
};
