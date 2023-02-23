import { JSONSchemaType } from "ajv";
import Ajv from "ajv";

const ajv = new Ajv();

export interface AchievementDto {
  id: number;
  name: string;
  description: string;
  tier: string;
  kind: string;
  visible: boolean;
  image?: string;
  nbr_of_success?: number;
  users_url: string;
}

export const achievementSchema: JSONSchemaType<AchievementDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    description: { type: "string" },
    tier: { type: "string" },
    kind: { type: "string" },
    visible: { type: "boolean" },
    image: { type: "string", nullable: true },
    nbr_of_success: { type: "number", nullable: true },
    users_url: { type: "string" },
  },
  required: [
    "id",
    "name",
    "description",
    "tier",
    "kind",
    "visible",
    "users_url",
  ],
  additionalProperties: true,
};

export const validateAchievement = ajv.compile(achievementSchema);
