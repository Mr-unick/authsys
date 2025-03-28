
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "../entity/Users";

import { Roles } from "../entity/Roles";
import { Business } from "../entity/Business";
import { SuperAdmin } from "../entity/SuperAdmin";
import { StageChangeHistory } from "../entity/StageChangeHistory";
import { Notification } from "../entity/Notifications";
import { Permissions } from "../entity/Permissions";
import { LoginLogoutLog } from "../entity/LoginLogoutLog";
import { Leads } from "../entity/Leads";
import { LeadStages } from "../entity/LeadStages";
import { AreaOfOperation } from "../entity/AreaOfOperation";
import { BuisnesAdmin } from "../entity/BuisnesAdmin";
import { Policy } from "../entity/Policy";
import { Branch } from "../entity/Branch";
import { Comment } from "../entity/Comment";


export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DBHOST,
  port: parseInt(process.env.DBPORT || '3306'),
  username: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}', Users, Business, Roles, SuperAdmin, StageChangeHistory, Notification, Permissions, LoginLogoutLog, Leads, LeadStages, AreaOfOperation, BuisnesAdmin, Policy, Branch, Comment],
});

await AppDataSource.initialize()
