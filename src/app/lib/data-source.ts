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
import { Activity } from "../entity/Activity";

/**
 * TypeORM DataSource — singleton with lazy initialization.
 * E9: Replaced top-level `await` with proper lifecycle management.
 */
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DBHOST || 'localhost',
  port: parseInt(process.env.DBPORT || '3306'),
  username: process.env.DBUSER || 'root',
  password: process.env.DBPASSWORD || '',
  database: process.env.DBNAME || 'authsys',
  synchronize: false,
  logging: false,
  entities: [
    Users,
    Business,
    Roles,
    SuperAdmin,
    StageChangeHistory,
    Notification,
    Permissions,
    LoginLogoutLog,
    Leads,
    LeadStages,
    AreaOfOperation,
    BuisnesAdmin,
    Policy,
    Branch,
    Comment,
    Activity,
  ],
});

/**
 * Ensures the DataSource is initialized before use.
 * Safe to call multiple times — only initializes once.
 */
export async function ensureDataSourceInitialized(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("[DB] DataSource initialized successfully");
    } catch (error) {
      console.error("[DB] Failed to initialize DataSource:", error);
      throw error;
    }
  }
  return AppDataSource;
}

// Auto-initialize on first import (replaces the old top-level await)
// This is safe because the promise is handled internally
ensureDataSourceInitialized().catch((err) => {
  console.error("[DB] Critical: Could not connect to database on startup:", err.message);
});
