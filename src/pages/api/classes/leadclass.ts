import { AppDataSource } from "@/app/lib/data-source";
import { Leads } from "@/app/entity/Leads";
import { Users } from "@/app/entity/Users";
import { Comment } from "@/app/entity/Comment";
import { Activity } from "@/app/entity/Activity";
import { StageChangeHistory } from "@/app/entity/StageChangeHistory";
import { LeadStages } from "@/app/entity/LeadStages";
import { Business } from "@/app/entity/Business";

class LeadClass {
    private leadId?: number;

    constructor(leadId?: number) {
        this.leadId = leadId;
    }

    // Create a new lead
    async createLead(leadData: Partial<Leads>) {
        const leadRepository = AppDataSource.getRepository(Leads);
        const newLead = leadRepository.create(leadData);
        return await leadRepository.save(newLead);
    }

    // Get lead by ID with all relations
    async getLeadById() {
        if (!this.leadId) throw new Error("Lead ID is required");
        
        return await AppDataSource.getRepository(Leads)
            .createQueryBuilder("lead")
            .leftJoinAndSelect("lead.users", "users")
            .leftJoinAndSelect("lead.stage", "stage")
            .leftJoinAndSelect("lead.business", "business")
            .leftJoinAndSelect("lead.comments", "comments")
            .leftJoinAndSelect("lead.activities", "activities")
            .leftJoinAndSelect("lead.history", "history")
            .where("lead.id = :id", { id: this.leadId })
            .getOne();
    }

    // Update lead
    async updateLead(updateData: Partial<Leads>) {
        if (!this.leadId) throw new Error("Lead ID is required");
        
        const leadRepository = AppDataSource.getRepository(Leads);
        await leadRepository.update(this.leadId, updateData);
        return await this.getLeadById();
    }

    // Delete lead
    async deleteLead() {
        if (!this.leadId) throw new Error("Lead ID is required");
        
        const leadRepository = AppDataSource.getRepository(Leads);
        return await leadRepository.delete(this.leadId);
    }

    // Get all leads with relations
    async getAllLeads(businessId?: number) {
        const query = AppDataSource.getRepository(Leads)
            .createQueryBuilder("lead")
            .leftJoinAndSelect("lead.users", "users")
            .leftJoinAndSelect("lead.stage", "stage")
            .leftJoinAndSelect("lead.business", "business")
            .leftJoinAndSelect("lead.comments", "comments")
            .leftJoinAndSelect("lead.activities", "activities")
            .leftJoinAndSelect("lead.history", "history");

        if (businessId) {
            query.where("lead.businessId = :businessId", { businessId });
        }

        return await query.getMany();
    }

    // Get lead's comments
    async getLeadComments() {
        if (!this.leadId) throw new Error("Lead ID is required");
        
        return await AppDataSource.getRepository(Leads)
            .createQueryBuilder("lead")
            .leftJoinAndSelect("lead.comments", "comments")
            .leftJoinAndSelect("comments.user", "user")
            .where("lead.id = :id", { id: this.leadId })
            .getOne();
    }

    // Get lead's activities
    async getLeadActivities() {
        if (!this.leadId) throw new Error("Lead ID is required");
        
        return await AppDataSource.getRepository(Leads)
            .createQueryBuilder("lead")
            .leftJoinAndSelect("lead.activities", "activities")
            .leftJoinAndSelect("activities.user", "user")
            .where("lead.id = :id", { id: this.leadId })
            .getOne();
    }

    // Get lead's stage history
    async getLeadStageHistory() {
        if (!this.leadId) throw new Error("Lead ID is required");
        
        return await AppDataSource.getRepository(Leads)
            .createQueryBuilder("lead")
            .leftJoinAndSelect("lead.history", "history")
            .leftJoinAndSelect("history.changed_by", "changed_by")
            .where("lead.id = :id", { id: this.leadId })
            .getOne();
    }

    // Assign users to lead
    async assignUsersToLead(userIds: number[]) {
        if (!this.leadId) throw new Error("Lead ID is required");
        
        const leadRepository = AppDataSource.getRepository(Leads);
        const userRepository = AppDataSource.getRepository(Users);
        
        const lead = await this.getLeadById();
        if (!lead) throw new Error("Lead not found");
        
        const users = await userRepository.findByIds(userIds);
        lead.users = users;
        return await leadRepository.save(lead);
    }

    // Change lead stage
    async changeLeadStage(stageId: number, changedByUserId: number) {
        if (!this.leadId) throw new Error("Lead ID is required");
        
        const leadRepository = AppDataSource.getRepository(Leads);
        const stageRepository = AppDataSource.getRepository(LeadStages);
        
        const lead = await this.getLeadById();
        if (!lead) throw new Error("Lead not found");
        
        const newStage = await stageRepository.findOne({ where: { id: stageId } });
        if (!newStage) throw new Error("Stage not found");
        
        const oldStage = lead.stage;
        // lead.stage = newStage;
        await leadRepository.save(lead);
        
        // Create stage change history
        const history = new StageChangeHistory();
        // history.lead = lead;
        const changedBy = await AppDataSource.getRepository(Users).findOne({ where: { id: changedByUserId } });
        if (!changedBy) throw new Error("User not found");
        // history.changed_by = changedBy;
        // history.old_stage = oldStage;
        // history.new_stage = newStage;
        
        await AppDataSource.getRepository(StageChangeHistory).save(history);
        
        return await this.getLeadById();
    }
}

export default LeadClass;
