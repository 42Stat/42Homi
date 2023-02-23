import { JSONSchemaType } from "ajv";
import { SimpleUserDto, simpleUserSchema } from "./simple-user.interface";

export interface CursusUserDto {
  grade?: string;
  level: number;
  skills: SkillDto[];
  blackholed_at?: string;
  id: number;
  begin_at: string;
  end_at?: string;
  cursus_id: number;
  has_coalition: boolean;
  created_at: string;
  updated_at: string;
  user: SimpleUserDto;
  cursus: CursusDto;
}

interface CursusDto {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  kind: string;
}

interface SkillDto {
  id: number;
  name: string;
  level: number;
}

const skillSchema: JSONSchemaType<SkillDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    level: { type: "number" },
  },
  required: ["id", "name", "level"],
  additionalProperties: true,
};

const cursusSchema: JSONSchemaType<CursusDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    created_at: { type: "string" },
    name: { type: "string" },
    slug: { type: "string" },
    kind: { type: "string" },
  },
  required: ["id", "created_at", "name", "slug", "kind"],
  additionalProperties: false,
};

export const cursusUserSchema: JSONSchemaType<CursusUserDto> = {
  type: "object",
  properties: {
    grade: { type: "string", nullable: true },
    level: { type: "number" },
    skills: {
      type: "array",
      items: skillSchema,
    },
    blackholed_at: { type: "string", nullable: true },
    id: { type: "number" },
    begin_at: { type: "string" },
    end_at: { type: "string", nullable: true },
    cursus_id: { type: "number" },
    has_coalition: { type: "boolean" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
    user: simpleUserSchema,
    cursus: cursusSchema,
  },
  required: [
    "level",
    "skills",
    "id",
    "begin_at",
    "cursus_id",
    "has_coalition",
    "created_at",
    "updated_at",
    "user",
    "cursus",
  ],
  additionalProperties: true,
};
