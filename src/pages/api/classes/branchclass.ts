import prisma from "@/app/lib/prisma";
import { Branch } from "@prisma/client";

class BranchClass {
    private branchId?: number;

    constructor(branchId?: number) {
        this.branchId = branchId;
    }

    // Create a new branch
    async createBranch(branchData: any) {
        return await prisma.branch.create({
            data: branchData
        });
    }

    // Get branch by ID with relations
    async getBranchById() {
        if (!this.branchId) throw new Error("Branch ID is required");

        return await prisma.branch.findUnique({
            where: { id: this.branchId },
            include: {
                business: true,
                roles: true
            }
        });
    }

    // Update branch
    async updateBranch(updateData: any) {
        if (!this.branchId) throw new Error("Branch ID is required");

        await prisma.branch.update({
            where: { id: this.branchId },
            data: updateData
        });
        return await this.getBranchById();
    }

    // Delete branch
    async deleteBranch() {
        if (!this.branchId) throw new Error("Branch ID is required");

        return await prisma.branch.delete({
            where: { id: this.branchId }
        });
    }

    // Get all branches for a business
    async getBusinessBranches(businessId: number) {
        return await prisma.branch.findMany({
            where: { business_id: businessId },
            include: {
                business: true,
                roles: true
            }
        });
    }

    // Get branch with business details
    async getBranchWithBusiness() {
        if (!this.branchId) throw new Error("Branch ID is required");

        return await prisma.branch.findUnique({
            where: { id: this.branchId },
            include: {
                business: true
            }
        });
    }

    // Get branch roles
    async getBranchRoles() {
        if (!this.branchId) throw new Error("Branch ID is required");

        return await prisma.branch.findUnique({
            where: { id: this.branchId },
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

    // Assign roles to branch
    async assignRolesToBranch(roleIds: number[]) {
        if (!this.branchId) throw new Error("Branch ID is required");

        return await prisma.branch.update({
            where: { id: this.branchId },
            data: {
                roles: {
                    set: roleIds.map(id => ({ id }))
                }
            },
            include: {
                roles: true
            }
        });
    }

    // Search branches
    async searchBranches(searchTerm: string, businessId?: number) {
        return await prisma.branch.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm } },
                    { address: { contains: searchTerm } }
                ],
                ...(businessId ? { business_id: businessId } : {})
            },
            include: {
                business: true
            }
        });
    }

    // Get branch statistics
    async getBranchStats() {
        if (!this.branchId) throw new Error("Branch ID is required");

        const branch = await prisma.branch.findUnique({
            where: { id: this.branchId },
            include: {
                business: true
            }
        });
        if (!branch) throw new Error("Branch not found");

        const [userCount, roleCount] = await Promise.all([
            prisma.user.count({
                where: {
                    role: {
                        branch_id: this.branchId
                    }
                }
            }),
            prisma.role.count({
                where: {
                    branch_id: this.branchId
                }
            })
        ]);

        return {
            userCount,
            roleCount,
            branchDetails: {
                name: branch.name,
                address: branch.address,
                contact: branch.number
            }
        };
    }
}

export default BranchClass; 