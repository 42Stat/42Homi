import { JSONSchemaType } from "ajv";
import { SimpleUserDto, simpleUserSchema } from "./simple-user.interface";
import Ajv from "ajv";

const ajv = new Ajv();

export interface TeamUserDto {
  id: number;
  login: string;
  url: string;
  leader: boolean;
  occurrence: number;
  validated?: boolean;
  projects_user_id: number;
}

const teamUserSchema: JSONSchemaType<TeamUserDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    login: { type: "string" },
    url: { type: "string" },
    leader: { type: "boolean" },
    occurrence: { type: "number" },
    validated: { type: "boolean", nullable: true },
    projects_user_id: { type: "number" },
  },
  required: ["id", "login", "url", "leader", "occurrence", "projects_user_id"],
  additionalProperties: false,
};

export interface TeamDto {
  id: number;
  name: string;
  url: string;
  final_mark?: number;
  project_id: number;
  created_at: string;
  updated_at: string;
  status: string;
  terminating_at?: string;
  users: TeamUserDto[];
  locked?: boolean;
  validated?: boolean;
  closed?: boolean;
  locked_at?: string;
  closed_at?: string;
}

export const teamSchema: JSONSchemaType<TeamDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    url: { type: "string" },
    final_mark: { type: "number", nullable: true },
    project_id: { type: "number" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
    status: { type: "string" },
    terminating_at: { type: "string", nullable: true },
    users: { type: "array", items: teamUserSchema },
    locked: { type: "boolean", nullable: true },
    validated: { type: "boolean", nullable: true },
    closed: { type: "boolean", nullable: true },
    locked_at: { type: "string", nullable: true },
    closed_at: { type: "string", nullable: true },
  },
  required: [
    "id",
    "name",
    "url",
    "project_id",
    "created_at",
    "updated_at",
    "status",
    "users",
  ],
  additionalProperties: true,
};

export interface ProjectDto {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
}

export const projectSchema: JSONSchemaType<ProjectDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    slug: { type: "string" },
    parent_id: { type: "number", nullable: true },
  },
  required: ["id", "name", "slug"],
  additionalProperties: false,
};

export interface ProjectsUserDto {
  id: number;
  occurrence: number;
  final_mark?: number;
  status: string;
  validated?: boolean;
  current_team_id?: number;
  project: ProjectDto;
  cursus_ids: number[];
  marked_at?: string;
  marked: boolean;
  retriable_at?: string;
  created_at?: string;
  updated_at: string;
  user?: SimpleUserDto;
  teams?: TeamDto[];
}

export const projectsUserSchema: JSONSchemaType<ProjectsUserDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    occurrence: { type: "number" },
    final_mark: { type: "number", nullable: true },
    status: { type: "string" },
    validated: { type: "boolean", nullable: true },
    current_team_id: { type: "number", nullable: true },
    project: projectSchema,
    cursus_ids: {
      type: "array",
      items: { type: "number" },
    },
    marked_at: { type: "string", nullable: true },
    marked: { type: "boolean" },
    retriable_at: { type: "string", nullable: true },
    created_at: { type: "string", nullable: true },
    updated_at: { type: "string" },
    // set user nullable
    user: { ...simpleUserSchema, nullable: true },
    teams: { type: "array", items: teamSchema, nullable: true },
  },
  required: [
    "id",
    "occurrence",
    "status",
    "project",
    "cursus_ids",
    "marked",
    "updated_at",
  ],
  additionalProperties: true,
};

export const validateProjectsUser = ajv.compile(projectsUserSchema);
