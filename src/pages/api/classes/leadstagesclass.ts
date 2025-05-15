import { AppDataSource } from "@/app/lib/data-source";
import { LeadStages } from "@/app/entity/LeadStages";
import { Business } from "@/app/entity/Business";
import { Leads } from "@/app/entity/Leads";

class LeadStagesClass {
    private stageId?: number;

    constructor(stageId?: number) {
        this.stageId = stageId;
    }

    // Create a new lead stage
    async createStage(stageData: Partial<LeadStages>) {
        const stageRepository = AppDataSource.getRepository(LeadStages);
        const newStage = stageRepository.create(stageData);
        return await stageRepository.save(newStage);
    }

    // Get stage by ID with relations
    async getStageById() {
        if (!this.stageId) throw new Error("Stage ID is required");
        
        return await AppDataSource.getRepository(LeadStages)
            .createQueryBuilder("stage")
            .leftJoinAndSelect("stage.business", "business")
            .leftJoinAndSelect("stage.leads", "leads")
            .where("stage.id = :id", { id: this.stageId })
            .getOne();
    }

    // Update stage
    async updateStage(updateData: Partial<LeadStages>) {
        if (!this.stageId) throw new Error("Stage ID is required");
        
        const stageRepository = AppDataSource.getRepository(LeadStages);
        await stageRepository.update(this.stageId, updateData);
        return await this.getStageById();
    }

    // Delete stage
    async deleteStage() {
        if (!this.stageId) throw new Error("Stage ID is required");
        
        const stageRepository = AppDataSource.getRepository(LeadStages);
        return await stageRepository.delete(this.stageId);
    }

    // Get all stages for a business
    async getBusinessStages(businessId: number) {
        return await AppDataSource.getRepository(LeadStages)
            .createQueryBuilder("stage")
            .leftJoinAndSelect("stage.business", "business")
            .where("stage.buisnessId = :businessId", { businessId })
            .orderBy("stage.created_at", "ASC")
            .getMany();
    }

    // Get stage with business details
    async getStageWithBusiness() {
        if (!this.stageId) throw new Error("Stage ID is required");
        
        return await AppDataSource.getRepository(LeadStages)
            .createQueryBuilder("stage")
            .leftJoinAndSelect("stage.business", "business")
            .where("stage.id = :id", { id: this.stageId })
            .getOne();
    }

    // Get leads in this stage
    async getStageLeads() {
        if (!this.stageId) throw new Error("Stage ID is required");
        
        return await AppDataSource.getRepository(LeadStages)
            .createQueryBuilder("stage")
            .leftJoinAndSelect("stage.leads", "leads")
            .leftJoinAndSelect("leads.user", "user")
            .where("stage.id = :id", { id: this.stageId })
            .getOne();
    }

    // Move lead to this stage
    async moveLeadToStage(leadId: number) {
        if (!this.stageId) throw new Error("Stage ID is required");
        
        const leadRepository = AppDataSource.getRepository(Leads);
        const lead = await leadRepository.findOne({ where: { id: leadId } });
        
        if (!lead) throw new Error("Lead not found");
        
        // Update the lead's stage using a direct query
        await AppDataSource.createQueryBuilder()
            .update(Leads)
            .set({ stage: { id: this.stageId } })
            .where("id = :leadId", { leadId })
            .execute();
        
        return await leadRepository.findOne({ where: { id: leadId } });
    }

    // Get stage statistics
    async getStageStats() {
        if (!this.stageId) throw new Error("Stage ID is required");
        
        const stage = await this.getStageById();
        if (!stage) throw new Error("Stage not found");

        const leadCount = await AppDataSource.getRepository(Leads)
            .createQueryBuilder("lead")
            .leftJoin("lead.stage", "stage")
            .where("stage.id = :stageId", { stageId: this.stageId })
            .getCount();

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
        const stageRepository = AppDataSource.getRepository(LeadStages);
        
        for (const { id, order } of stageOrder) {
            await stageRepository.update(id, { created_at: new Date(order) });
        }
        
        return await this.getBusinessStages(businessId);
    }
}

export default LeadStagesClass; 