import prisma from "@/app/lib/prisma";
import { Lead, User, LeadStage, StageChangeHistory } from "@prisma/client";

class LeadClass {
    private leadId?: number;

    constructor(leadId?: number) {
        this.leadId = leadId;
    }

    // Create a new lead
    async createLead(leadData: any) {
        return await prisma.lead.create({
            data: leadData
        });
    }

    // Get lead by ID with all relations
    async getLeadById() {
        if (!this.leadId) throw new Error("Lead ID is required");

        return await prisma.lead.findUnique({
            where: { id: this.leadId },
            include: {
                leadUsers: { include: { user: true } },
                stage: true,
                business: true,
                comments: true,
                activities: true,
                history: true,
            }
        });
    }

    // Update lead
    async updateLead(updateData: any) {
        if (!this.leadId) throw new Error("Lead ID is required");

        await prisma.lead.update({
            where: { id: this.leadId },
            data: updateData
        });
        return await this.getLeadById();
    }

    // Delete lead
    async deleteLead() {
        if (!this.leadId) throw new Error("Lead ID is required");

        return await prisma.lead.delete({
            where: { id: this.leadId }
        });
    }

    // Get all leads with relations
    async getAllLeads(businessId?: number) {
        return await prisma.lead.findMany({
            where: businessId ? { business_id: businessId } : {},
            include: {
                leadUsers: { include: { user: true } },
                stage: true,
                business: true,
                comments: true,
                activities: true,
                history: true,
            }
        });
    }

    // Assign users to lead
    async assignUsersToLead(userIds: number[]) {
        if (!this.leadId) throw new Error("Lead ID is required");

        // Delete existing assignments and create new ones
        await prisma.leadUser.deleteMany({
            where: { lead_id: this.leadId }
        });

        await prisma.leadUser.createMany({
            data: userIds.map(uid => ({
                lead_id: this.leadId!,
                user_id: uid
            }))
        });

        return await prisma.lead.findUnique({
            where: { id: this.leadId },
            include: {
                leadUsers: { include: { user: true } }
            }
        });
    }

    // Change lead stage
    async changeLeadStage(stageId: number, changedByUserId: number) {
        if (!this.leadId) throw new Error("Lead ID is required");

        // Use transaction to ensure both happen or none
        return await prisma.$transaction(async (tx) => {
            const lead = await tx.lead.update({
                where: { id: this.leadId },
                data: {
                    stage_id: stageId
                }
            });

            await tx.stageChangeHistory.create({
                data: {
                    lead_id: this.leadId!,
                    stage_id: stageId,
                    user_id: changedByUserId,
                    changed_at: new Date(),
                    reason: "Stage updated via API"
                }
            });

            return await tx.lead.findUnique({
                where: { id: this.leadId },
                include: {
                    stage: true,
                    history: true
                }
            });
        });
    }
}

export default LeadClass;
