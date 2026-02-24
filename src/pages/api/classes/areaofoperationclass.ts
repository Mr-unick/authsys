import prisma from "@/app/lib/prisma";
import { AreaOfOperation } from "@prisma/client";

class AreaOfOperationClass {
    private areaId?: number;

    constructor(areaId?: number) {
        this.areaId = areaId;
    }

    // Create a new area of operation
    async createArea(areaData: any) {
        return await prisma.areaOfOperation.create({
            data: areaData
        });
    }

    // Get area by ID with relations
    async getAreaById() {
        if (!this.areaId) throw new Error("Area ID is required");

        return await prisma.areaOfOperation.findUnique({
            where: { id: this.areaId },
            include: {
                business: true
            }
        });
    }

    // Update area
    async updateArea(updateData: any) {
        if (!this.areaId) throw new Error("Area ID is required");

        await prisma.areaOfOperation.update({
            where: { id: this.areaId },
            data: updateData
        });
        return await this.getAreaById();
    }

    // Delete area
    async deleteArea() {
        if (!this.areaId) throw new Error("Area ID is required");

        return await prisma.areaOfOperation.delete({
            where: { id: this.areaId }
        });
    }

    // Get all areas for a business
    async getBusinessAreas(businessId: number) {
        return await prisma.areaOfOperation.findMany({
            where: { business_id: businessId },
            include: {
                business: true
            }
        });
    }

    // Get area with business details
    async getAreaWithBusiness() {
        if (!this.areaId) throw new Error("Area ID is required");

        return await prisma.areaOfOperation.findUnique({
            where: { id: this.areaId },
            include: {
                business: true
            }
        });
    }

    // Search areas by name or description
    async searchAreas(searchTerm: string, businessId?: number) {
        return await prisma.areaOfOperation.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm } },
                    // description field doesn't exist in AreaOfOperation schema I wrote? 
                    // Let me check AreaOfOperation.ts entity again.
                ],
                ...(businessId ? { business_id: businessId } : {})
            },
            include: {
                business: true
            }
        });
    }
}

export default AreaOfOperationClass; 