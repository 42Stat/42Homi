import { JSONSchemaType } from "ajv";
import Ajv from "ajv";
import { TeamDto, teamSchema } from "./projects-user.interface";

const ajv = new Ajv();

export interface flagDto {
  id: number;
  name: string;
  positive: boolean;
  created_at: string;
  updated_at: string;
}

const flagSchema: JSONSchemaType<flagDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    positive: { type: "boolean" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  required: ["id", "name", "positive", "created_at", "updated_at"],
  additionalProperties: true,
};

export interface ScaleTeamUserDto {
  id: number;
  login: string;
  url: string;
}

const scaleTeamUserSchema: JSONSchemaType<ScaleTeamUserDto> = {
  //   $id: "http://example.com/src/api/interface/scale-team.interface.ts/scaleTeamUser",
  type: "object",
  properties: {
    id: { type: "number" },
    login: { type: "string" },
    url: { type: "string" },
  },
  required: ["id", "login", "url"],
  additionalProperties: true,
};

export interface FeedbackDto {
  id: number;
  user?: ScaleTeamUserDto;
  comment: string;
  rating?: number;
  created_at: string;
}

const feedbackSchema: JSONSchemaType<FeedbackDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    user: {
      type: "object",
      properties: {
        id: { type: "number" },
        login: { type: "string" },
        url: { type: "string" },
      },
      required: ["id", "login", "url"],
      additionalProperties: true,
      nullable: true,
    },
    comment: { type: "string" },
    rating: { type: "number", nullable: true },
    created_at: { type: "string" },
  },
  required: ["id", "comment", "created_at"],
  additionalProperties: true,
};

export interface ScaleTeamDto {
  id: number;
  scale_id: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  feedback?: string;
  final_mark?: number;
  flag: flagDto;
  begin_at: string;
  correcteds: ScaleTeamUserDto[];
  corrector: ScaleTeamUserDto;
  filled_at?: string;
  team: TeamDto;
  feedbacks: FeedbackDto[];
}

export const scaleTeamSchema: JSONSchemaType<ScaleTeamDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    scale_id: { type: "number" },
    comment: { type: "string", nullable: true },
    created_at: { type: "string" },
    updated_at: { type: "string" },
    feedback: { type: "string", nullable: true },
    final_mark: { type: "number", nullable: true },
    flag: flagSchema,
    begin_at: { type: "string" },
    correcteds: { type: "array", items: scaleTeamUserSchema },
    corrector: scaleTeamUserSchema,
    filled_at: { type: "string", nullable: true },
    team: teamSchema,
    feedbacks: { type: "array", items: feedbackSchema, minItems: 0 },
  },
  required: [
    "id",
    "scale_id",
    "created_at",
    "updated_at",
    "flag",
    "begin_at",
    "correcteds",
    "corrector",
    "team",
  ],
  additionalProperties: true,
};

export const validateScaleTeam = ajv.compile(scaleTeamSchema);
