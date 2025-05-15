import { AppDataSource } from "@/app/lib/data-source";
import { AreaOfOperation } from "@/app/entity/AreaOfOperation";
import { Business } from "@/app/entity/Business";

class AreaOfOperationClass {
    private areaId?: number;

    constructor(areaId?: number) {
        this.areaId = areaId;
    }

    // Create a new area of operation
    async createArea(areaData: Partial<AreaOfOperation>) {
        const areaRepository = AppDataSource.getRepository(AreaOfOperation);
        const newArea = areaRepository.create(areaData);
        return await areaRepository.save(newArea);
    }

    // Get area by ID with relations
    async getAreaById() {
        if (!this.areaId) throw new Error("Area ID is required");
        
        return await AppDataSource.getRepository(AreaOfOperation)
            .createQueryBuilder("area")
            .leftJoinAndSelect("area.business_id", "business")
            .where("area.id = :id", { id: this.areaId })
            .getOne();
    }

    // Update area
    async updateArea(updateData: Partial<AreaOfOperation>) {
        if (!this.areaId) throw new Error("Area ID is required");
        
        const areaRepository = AppDataSource.getRepository(AreaOfOperation);
        await areaRepository.update(this.areaId, updateData);
        return await this.getAreaById();
    }

    // Delete area
    async deleteArea() {
        if (!this.areaId) throw new Error("Area ID is required");
        
        const areaRepository = AppDataSource.getRepository(AreaOfOperation);
        return await areaRepository.delete(this.areaId);
    }

    // Get all areas for a business
    async getBusinessAreas(businessId: number) {
        return await AppDataSource.getRepository(AreaOfOperation)
            .createQueryBuilder("area")
            .leftJoinAndSelect("area.business_id", "business")
            .where("area.business_id = :businessId", { businessId })
            .getMany();
    }

    // Get area with business details
    async getAreaWithBusiness() {
        if (!this.areaId) throw new Error("Area ID is required");
        
        return await AppDataSource.getRepository(AreaOfOperation)
            .createQueryBuilder("area")
            .leftJoinAndSelect("area.business_id", "business")
            .where("area.id = :id", { id: this.areaId })
            .getOne();
    }

    // Search areas by name or description
    async searchAreas(searchTerm: string, businessId?: number) {
        const query = AppDataSource.getRepository(AreaOfOperation)
            .createQueryBuilder("area")
            .leftJoinAndSelect("area.business_id", "business")
            .where("area.name LIKE :searchTerm OR area.description LIKE :searchTerm", 
                { searchTerm: `%${searchTerm}%` });

        if (businessId) {
            query.andWhere("area.business_id = :businessId", { businessId });
        }

        return await query.getMany();
    }
}

export default AreaOfOperationClass; 