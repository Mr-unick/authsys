import { AppDataSource } from "@/app/lib/data-source";
import { Activity } from "@/app/entity/Activity";
import { Users } from "@/app/entity/Users";
import { Leads } from "@/app/entity/Leads";

class ActivityClass {
    private activityId?: number;

    constructor(activityId?: number) {
        this.activityId = activityId;
    }

    // Create a new activity
    async createActivity(activityData: Partial<Activity>) {
        const activityRepository = AppDataSource.getRepository(Activity);
        const newActivity = activityRepository.create(activityData);
        return await activityRepository.save(newActivity);
    }

    // Get activity by ID with relations
    async getActivityById() {
        if (!this.activityId) throw new Error("Activity ID is required");
        
        return await AppDataSource.getRepository(Activity)
            .createQueryBuilder("activity")
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.lead", "lead")
            .where("activity.id = :id", { id: this.activityId })
            .getOne();
    }

    // Update activity
    async updateActivity(updateData: Partial<Activity>) {
        if (!this.activityId) throw new Error("Activity ID is required");
        
        const activityRepository = AppDataSource.getRepository(Activity);
        await activityRepository.update(this.activityId, updateData);
        return await this.getActivityById();
    }

    // Delete activity
    async deleteActivity() {
        if (!this.activityId) throw new Error("Activity ID is required");
        
        const activityRepository = AppDataSource.getRepository(Activity);
        return await activityRepository.delete(this.activityId);
    }

    // Get all activities for a lead
    async getLeadActivities(leadId: number) {
        return await AppDataSource.getRepository(Activity)
            .createQueryBuilder("activity")
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.lead", "lead")
            .where("activity.leadId = :leadId", { leadId })
            .orderBy("activity.timestamp", "DESC")
            .getMany();
    }

    // Get all activities by a user
    async getUserActivities(userId: number) {
        return await AppDataSource.getRepository(Activity)
            .createQueryBuilder("activity")
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.lead", "lead")
            .where("activity.userId = :userId", { userId })
            .orderBy("activity.timestamp", "DESC")
            .getMany();
    }

    // Get activities by type
    async getActivitiesByType(type: string) {
        return await AppDataSource.getRepository(Activity)
            .createQueryBuilder("activity")
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.lead", "lead")
            .where("activity.type = :type", { type })
            .orderBy("activity.timestamp", "DESC")
            .getMany();
    }

    // Get recent activities
    async getRecentActivities(limit: number = 10) {
        return await AppDataSource.getRepository(Activity)
            .createQueryBuilder("activity")
            .leftJoinAndSelect("activity.user", "user")
            .leftJoinAndSelect("activity.lead", "lead")
            .orderBy("activity.timestamp", "DESC")
            .take(limit)
            .getMany();
    }
}

export default ActivityClass; 