import prisma from "@/app/lib/prisma";
import { LeadStage } from "@prisma/client";

class LeadStagesClass {
    private stageId?: number;

    constructor(stageId?: number) {
        this.stageId = stageId;
    }

    // Create a new lead stage
    async createStage(stageData: any) {
        return await prisma.leadStage.create({
            data: stageData
        });
    }

    // Get stage by ID with relations
    async getStageById() {
        if (!this.stageId) throw new Error("Stage ID is required");

        return await prisma.leadStage.findUnique({
            where: { id: this.stageId },
            include: {
                business: true,
                leads: true
            }
        });
    }

    // Update stage
    async updateStage(updateData: any) {
        if (!this.stageId) throw new Error("Stage ID is required");

        await prisma.leadStage.update({
            where: { id: this.stageId },
            data: updateData
        });
        return await this.getStageById();
    }

    // Delete stage
    async deleteStage() {
        if (!this.stageId) throw new Error("Stage ID is required");

        return await prisma.leadStage.delete({
            where: { id: this.stageId }
        });
    }

    // Get all stages for a business
    async getBusinessStages(businessId: number) {
        return await prisma.leadStage.findMany({
            where: { business_id: businessId },
            include: {
                business: true
            },
            orderBy: {
                created_at: "asc"
            }
        });
    }

    // Get stage with business details
    async getStageWithBusiness() {
        if (!this.stageId) throw new Error("Stage ID is required");

        return await prisma.leadStage.findUnique({
            where: { id: this.stageId },
            include: {
                business: true
            }
        });
    }

    // Get leads in this stage
    async getStageLeads() {
        if (!this.stageId) throw new Error("Stage ID is required");

        return await prisma.leadStage.findUnique({
            where: { id: this.stageId },
            include: {
                leads: {
                    include: {
                        leadUsers: { include: { user: true } }
                    }
                }
            }
        });
    }

    // Move lead to this stage
    async moveLeadToStage(leadId: number) {
        if (!this.stageId) throw new Error("Stage ID is required");

        return await prisma.lead.update({
            where: { id: leadId },
            data: {
                stage_id: this.stageId
            }
        });
    }

    // Get stage statistics
    async getStageStats() {
        if (!this.stageId) throw new Error("Stage ID is required");

        const stage = await prisma.leadStage.findUnique({
            where: { id: this.stageId }
        });
        if (!stage) throw new Error("Stage not found");

        const leadCount = await prisma.lead.count({
            where: { stage_id: this.stageId }
        });

        return {
            leadCount,
            stageDetails: {
                name: stage.stage_name,
                description: stage.discription,
                colour: stage.colour
            }
        };
    }

    // Reorder stages
    async reorderStages(businessId: number, stageOrder: { id: number; order: number }[]) {
        // Sequentially update each stage order
        for (const { id, order } of stageOrder) {
            await prisma.leadStage.update({
                where: { id },
                data: { created_at: new Date(order) }
            });
        }

        return await this.getBusinessStages(businessId);
    }
}

export default LeadStagesClass; 