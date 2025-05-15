import { AppDataSource } from "@/app/lib/data-source";
import { Business } from "@/app/entity/Business";
import { Users } from "@/app/entity/Users";
import { Roles } from "@/app/entity/Roles";
import { Leads } from "@/app/entity/Leads";
import { AreaOfOperation } from "@/app/entity/AreaOfOperation";
import { LeadStages } from "@/app/entity/LeadStages";
import { Branch } from "@/app/entity/Branch";

class BusinessClass {
    private businessId?: number;

    constructor(businessId?: number) {
        this.businessId = businessId;
    }

    // Create a new business
    async createBusiness(businessData: Partial<Business>) {
        const businessRepository = AppDataSource.getRepository(Business);
        const newBusiness = businessRepository.create(businessData);
        return await businessRepository.save(newBusiness);
    }

    // Get business by ID with relations
    async getBusinessById() {
        if (!this.businessId) throw new Error("Business ID is required");
        
        return await AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .leftJoinAndSelect("business.users", "users")
            .leftJoinAndSelect("business.role", "roles")
            .leftJoinAndSelect("business.areasOfOperation", "areasOfOperation")
            .leftJoinAndSelect("business.leadStages", "leadStages")
            .leftJoinAndSelect("business.branches", "branches")
            .where("business.id = :id", { id: this.businessId })
            .getOne();
    }

    // Update business
    async updateBusiness(updateData: Partial<Business>) {
        if (!this.businessId) throw new Error("Business ID is required");
        
        const businessRepository = AppDataSource.getRepository(Business);
        await businessRepository.update(this.businessId, updateData);
        return await this.getBusinessById();
    }

    // Delete business
    async deleteBusiness() {
        if (!this.businessId) throw new Error("Business ID is required");
        
        const businessRepository = AppDataSource.getRepository(Business);
        return await businessRepository.delete(this.businessId);
    }

    // Get all businesses
    async getAllBusinesses() {
        return await AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .leftJoinAndSelect("business.users", "users")
            .leftJoinAndSelect("business.role", "roles")
            .getMany();
    }

    // Get business users
    async getBusinessUsers() {
        if (!this.businessId) throw new Error("Business ID is required");
        
        return await AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .leftJoinAndSelect("business.users", "users")
            .leftJoinAndSelect("users.role", "role")
            .where("business.id = :id", { id: this.businessId })
            .getOne();
    }

    // Get business roles
    async getBusinessRoles() {
        if (!this.businessId) throw new Error("Business ID is required");
        
        return await AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .leftJoinAndSelect("business.role", "roles")
            .leftJoinAndSelect("roles.permissions", "permissions")
            .where("business.id = :id", { id: this.businessId })
            .getOne();
    }

    // Get business leads
    async getBusinessLeads() {
        if (!this.businessId) throw new Error("Business ID is required");
        
        return await AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .leftJoinAndSelect("business.leads", "leads")
            .leftJoinAndSelect("leads.users", "users")
            .leftJoinAndSelect("leads.stage", "stage")
            .where("business.id = :id", { id: this.businessId })
            .getOne();
    }

    // Get business areas of operation
    async getBusinessAreas() {
        if (!this.businessId) throw new Error("Business ID is required");
        
        return await AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .leftJoinAndSelect("business.areasOfOperation", "areasOfOperation")
            .where("business.id = :id", { id: this.businessId })
            .getOne();
    }

    // Add area of operation to business
    async addAreaOfOperation(areaData: Partial<AreaOfOperation>) {
        if (!this.businessId) throw new Error("Business ID is required");
        
        const business = await this.getBusinessById();
        if (!business) throw new Error("Business not found");

        const areaRepository = AppDataSource.getRepository(AreaOfOperation);
        const newArea = areaRepository.create({
            ...areaData,
            business_id: this.businessId
        });
        
        return await areaRepository.save(newArea);
    }

    // Get business lead stages
    async getBusinessLeadStages() {
        if (!this.businessId) throw new Error("Business ID is required");
        
        return await AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .leftJoinAndSelect("business.leadStages", "leadStages")
            .where("business.id = :id", { id: this.businessId })
            .getOne();
    }

    // Add lead stage to business
    async addLeadStage(stageData: LeadStages) {
        if (!this.businessId) throw new Error("Business ID is required");
        
        const business = await this.getBusinessById();
        if (!business) throw new Error("Business not found");

        const stageRepository = AppDataSource.getRepository(LeadStages);
        const newStage = stageRepository.create({
            ...stageData,
            // business: business
        });
        
        return await stageRepository.save(newStage);
    }

    // Get business branches
    async getBusinessBranches() {
        if (!this.businessId) throw new Error("Business ID is required");
        
        return await AppDataSource.getRepository(Business)
            .createQueryBuilder("business")
            .leftJoinAndSelect("business.branches", "branches")
            .where("business.id = :id", { id: this.businessId })
            .getOne();
    }

    // Add branch to business
    async addBranch(branchData: Partial<Branch>) {
        if (!this.businessId) throw new Error("Business ID is required");
        
        const business = await this.getBusinessById();
        if (!business) throw new Error("Business not found");

        const branchRepository = AppDataSource.getRepository(Branch);
        const newBranch = branchRepository.create({
            ...branchData,
            // buisness: business
        });
        
        return await branchRepository.save(newBranch);
    }

    // Get business statistics
    // async getBusinessStats() {
    //     if (!this.businessId) throw new Error("Business ID is required");
        
    //     const business = await this.getBusinessById();
    //     if (!business) throw new Error("Business not found");

    //     const [userCount, leadCount, branchCount] = await Promise.all([
    //         AppDataSource.getRepository(Users).count({ where: { buisnesId: this.businessId } }),
    //         AppDataSource.getRepository(Leads).count({ where: { businessId: this.businessId } }),
    //         AppDataSource.getRepository(Branch).count({ where: { buisnessId: this.businessId } })
    //     ]);

    //     return {
    //         userCount,
    //         leadCount,
    //         branchCount,
    //         businessDetails: {
    //             name: business.business_name,
    //             email: business.email,
    //             contact: business.contact_number
    //         }
    //     };
    // }
}

export default BusinessClass; 