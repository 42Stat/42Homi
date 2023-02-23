import { JSONSchemaType } from "ajv";
import Ajv from "ajv";

const ajv = new Ajv();

export interface CoalitionUserDto {
  id: number;
  coalition_id: number;
  user_id: number;
  updated_at: string;
  created_at: string;
}

export interface CoalitionUser {
  id: number;
  coalitionId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

const coalitionUserSchema: JSONSchemaType<CoalitionUserDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    coalition_id: { type: "number" },
    user_id: { type: "number" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  required: ["id", "coalition_id", "user_id", "created_at", "updated_at"],
  additionalProperties: true,
};

export const validateCoalitionUser = ajv.compile(coalitionUserSchema);
