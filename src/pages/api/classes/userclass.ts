import { AppDataSource } from "@/app/lib/data-source";
import { Users } from "@/app/entity/Users";
import { Leads } from "@/app/entity/Leads";
import { Comment } from "@/app/entity/Comment";
import { Activity } from "@/app/entity/Activity";
import { LoginLogoutLog } from "@/app/entity/LoginLogoutLog";
import { StageChangeHistory } from "@/app/entity/StageChangeHistory";

class Userclass {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId;
    }

    // Get basic user information
    async getUserInfo() {
        return await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("user.business", "business")
            .where("user.id = :id", { id: this.userId })
            .getOne();
    }

    // Get user's leads
    async getUserLeads() {
        return await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.leads", "leads")
            .where("user.id = :id", { id: this.userId })
            .getOne();
    }

    // Get user's comments
    async getUserComments() {
        return await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.comment", "comments")
            .where("user.id = :id", { id: this.userId })
            .getOne();
    }

    // Get user's activities
    async getUserActivities() {
        return await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.activities", "activities")
            .leftJoinAndSelect("activities.lead", "lead")
            .where("user.id = :id", { id: this.userId })
            .getOne();
    }

    // Get user's login/logout logs
    async getUserLoginLogs() {
        return await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.loginLogoutLogs", "logs")
            .where("user.id = :id", { id: this.userId })
            .getOne();
    }

    // Get user's stage change history
    async getUserStageHistory() {
        return await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.history", "history")
            .where("user.id = :id", { id: this.userId })
            .getOne();
    }

    // Get all user data at once
    async getAllUserData() {
        return await AppDataSource.getRepository(Users)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("user.business", "business")
            .leftJoinAndSelect("user.leads", "leads")
            .leftJoinAndSelect("user.comment", "comments")
            .leftJoinAndSelect("user.activities", "activities")
            .leftJoinAndSelect("activities.lead", "lead")
            .leftJoinAndSelect("user.loginLogoutLogs", "logs")
            .leftJoinAndSelect("user.history", "history")
            .where("user.id = :id", { id: this.userId })
            .getOne();
    }
}

export default Userclass;