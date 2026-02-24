import prisma from "@/app/lib/prisma";
import { Business, AreaOfOperation, LeadStage, Branch, User, Lead } from "@prisma/client";

class BusinessClass {
    private businessId?: number;

    constructor(businessId?: number) {
        this.businessId = businessId;
    }

    // Create a new business
    async createBusiness(businessData: any) {
        return await prisma.business.create({
            data: businessData
        });
    }

    // Get business by ID with relations
    async getBusinessById() {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.business.findUnique({
            where: { id: this.businessId },
            include: {
                users: true,
                roles: true,
                areasOfOperation: true,
                leadStages: true,
                branches: true,
            }
        });
    }

    // Update business
    async updateBusiness(updateData: any) {
        if (!this.businessId) throw new Error("Business ID is required");

        await prisma.business.update({
            where: { id: this.businessId },
            data: updateData
        });
        return await this.getBusinessById();
    }

    // Delete business
    async deleteBusiness() {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.business.delete({
            where: { id: this.businessId }
        });
    }

    // Get all businesses
    async getAllBusinesses() {
        return await prisma.business.findMany({
            include: {
                users: true,
                roles: true,
            }
        });
    }

    // Get business users
    async getBusinessUsers() {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.business.findUnique({
            where: { id: this.businessId },
            include: {
                users: {
                    include: {
                        role: true
                    }
                }
            }
        });
    }

    // Get business roles
    async getBusinessRoles() {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.business.findUnique({
            where: { id: this.businessId },
            include: {
                roles: {
                    include: {
                        rolePermissions: {
                            include: { permission: true }
                        }
                    }
                }
            }
        });
    }

    // Get business leads
    async getBusinessLeads() {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.business.findUnique({
            where: { id: this.businessId },
            include: {
                leads: {
                    include: {
                        leadUsers: { include: { user: true } },
                        stage: true
                    }
                }
            }
        });
    }

    // Get business areas of operation
    async getBusinessAreas() {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.business.findUnique({
            where: { id: this.businessId },
            include: {
                areasOfOperation: true
            }
        });
    }

    // Add area of operation to business
    async addAreaOfOperation(areaData: any) {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.areaOfOperation.create({
            data: {
                ...areaData,
                business_id: this.businessId
            }
        });
    }

    // Get business lead stages
    async getBusinessLeadStages() {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.business.findUnique({
            where: { id: this.businessId },
            include: {
                leadStages: true
            }
        });
    }

    // Add lead stage to business
    async addLeadStage(stageData: any) {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.leadStage.create({
            data: {
                ...stageData,
                business_id: this.businessId
            }
        });
    }

    // Get business branches
    async getBusinessBranches() {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.business.findUnique({
            where: { id: this.businessId },
            include: {
                branches: true
            }
        });
    }

    // Add branch to business
    async addBranch(branchData: any) {
        if (!this.businessId) throw new Error("Business ID is required");

        return await prisma.branch.create({
            data: {
                ...branchData,
                business_id: this.businessId
            }
        });
    }

    // Get business statistics
    async getBusinessStats() {
        if (!this.businessId) throw new Error("Business ID is required");

        const business = await prisma.business.findUnique({
            where: { id: this.businessId }
        });
        if (!business) throw new Error("Business not found");

        const [userCount, leadCount, branchCount] = await Promise.all([
            prisma.user.count({ where: { business_id: this.businessId } }),
            prisma.lead.count({ where: { business_id: this.businessId } }),
            prisma.branch.count({ where: { business_id: this.businessId } })
        ]);

        return {
            userCount,
            leadCount,
            branchCount,
            businessDetails: {
                name: business.business_name,
                email: business.email,
                contact: business.contact_number
            }
        };
    }
}

export default BusinessClass;