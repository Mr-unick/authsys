import prisma from "@/app/lib/prisma";
import { Activity } from "@prisma/client";

class ActivityClass {
    private activityId?: number;

    constructor(activityId?: number) {
        this.activityId = activityId;
    }

    // Create a new activity
    async createActivity(activityData: any) {
        return await prisma.activity.create({
            data: activityData
        });
    }

    // Get activity by ID with relations
    async getActivityById() {
        if (!this.activityId) throw new Error("Activity ID is required");

        return await prisma.activity.findUnique({
            where: { id: this.activityId },
            include: {
                user: true,
                lead: true
            }
        });
    }

    // Update activity
    async updateActivity(updateData: any) {
        if (!this.activityId) throw new Error("Activity ID is required");

        await prisma.activity.update({
            where: { id: this.activityId },
            data: updateData
        });
        return await this.getActivityById();
    }

    // Delete activity
    async deleteActivity() {
        if (!this.activityId) throw new Error("Activity ID is required");

        return await prisma.activity.delete({
            where: { id: this.activityId }
        });
    }

    // Get all activities for a lead
    async getLeadActivities(leadId: number) {
        return await prisma.activity.findMany({
            where: { lead_id: leadId },
            include: {
                user: true,
                lead: true
            },
            orderBy: {
                timestamp: "desc"
            }
        });
    }

    // Get all activities by a user
    async getUserActivities(userId: number) {
        return await prisma.activity.findMany({
            where: { user_id: userId },
            include: {
                user: true,
                lead: true
            },
            orderBy: {
                timestamp: "desc"
            }
        });
    }

    // Get activities by type
    async getActivitiesByType(type: string) {
        return await prisma.activity.findMany({
            where: { type },
            include: {
                user: true,
                lead: true
            },
            orderBy: {
                timestamp: "desc"
            }
        });
    }

    // Get recent activities
    async getRecentActivities(limit: number = 10) {
        return await prisma.activity.findMany({
            include: {
                user: true,
                lead: true
            },
            orderBy: {
                timestamp: "desc"
            },
            take: limit
        });
    }
}

export default ActivityClass; 