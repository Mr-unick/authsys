import prisma from "@/app/lib/prisma";
import { User, Lead, Comment, Activity, LoginLogoutLog, StageChangeHistory } from "@prisma/client";

class Userclass {
    private userId: number;

    constructor(userId: number) {
        this.userId = userId;
    }

    // Get basic user information
    async getUserInfo() {
        return await prisma.user.findUnique({
            where: { id: this.userId },
            include: {
                role: true,
                business: true
            }
        });
    }

    // Get user's leads
    async getUserLeads() {
        return await prisma.user.findUnique({
            where: { id: this.userId },
            include: {
                leadUsers: { include: { lead: true } }
            }
        });
    }

    // Get user's comments
    async getUserComments() {
        return await prisma.user.findUnique({
            where: { id: this.userId },
            include: {
                comments: true
            }
        });
    }

    // Get user's activities
    async getUserActivities() {
        return await prisma.user.findUnique({
            where: { id: this.userId },
            include: {
                activities: {
                    include: {
                        lead: true
                    }
                }
            }
        });
    }

    // Get user's login/logout logs
    async getUserLoginLogs() {
        return await prisma.user.findUnique({
            where: { id: this.userId },
            include: {
                logs: true
            }
        });
    }

    // Get user's stage change history
    async getUserStageHistory() {
        return await prisma.user.findUnique({
            where: { id: this.userId },
            include: {
                history: true
            }
        });
    }

    // Get all user data at once
    async getAllUserData() {
        return await prisma.user.findUnique({
            where: { id: this.userId },
            include: {
                role: true,
                business: true,
                leadUsers: { include: { lead: true } },
                comments: true,
                activities: {
                    include: {
                        lead: true
                    }
                },
                logs: true,
                history: true
            }
        });
    }
}

export default Userclass;