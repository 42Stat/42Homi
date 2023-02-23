import { JSONSchemaType } from "ajv";

export interface TitleDto {
  id: number;
  name: string;
}

export const titleSchema: JSONSchemaType<TitleDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
  },
  required: ["id", "name"],
  additionalProperties: false,
};
