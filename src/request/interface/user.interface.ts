import { JSONSchemaType } from "ajv";
import { SimpleUserDto, simpleUserSchema } from "./simple-user.interface";
import { UserImageDto, userImageSchema } from "./userimage.interface";
import Ajv from "ajv";
import { achievementSchema, AchievementDto } from "./achievement.interface";
import { CursusUserDto, cursusUserSchema } from "./cursus-user.interface";
import { TitleDto, titleSchema } from "./title.interface";
import { ProjectsUserDto, projectsUserSchema } from "./projects-user.interface";

export interface UserDto {
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
  pool_month: string;
  pool_year: string;
  wallet: number;
  alumni?: boolean;
  active?: boolean;
  cursus_users: CursusUserDto[];
  projects_users: ProjectsUserDto[];
  achievements: AchievementDto[];
  titles: TitleDto[];
}

// make all ajv schemas of above types
export const userSchema: JSONSchemaType<UserDto> = {
  $id: "user",
  type: "object",
  properties: {
    id: { type: "number" },
    email: { type: "string" },
    login: { type: "string" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    displayname: { type: "string" },
    kind: { type: "string" },
    image: { $ref: userImageSchema.$id as string },
    staff: { type: "boolean", nullable: true },
    correction_point: { type: "number" },
    pool_month: { type: "string" },
    pool_year: { type: "string" },
    wallet: { type: "number" },
    alumni: { type: "boolean", nullable: true },
    active: { type: "boolean", nullable: true },
    cursus_users: {
      type: "array",
      items: cursusUserSchema,
    },
    projects_users: {
      type: "array",
      items: projectsUserSchema,
    },
    achievements: {
      type: "array",
      items: achievementSchema,
    },
    titles: {
      type: "array",
      items: titleSchema,
    },
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
    "pool_month",
    "pool_year",
    "wallet",
    "cursus_users",
    "projects_users",
    "achievements",
    "titles",
  ],
  additionalProperties: true,
};

const ajv = new Ajv();
export const validateUser = ajv.compile(userSchema);
