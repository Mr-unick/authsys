import { AppDataSource } from "@/app/lib/data-source";
import { Branch } from "@/app/entity/Branch";
import { Business } from "@/app/entity/Business";
import { Users } from "@/app/entity/Users";
import { Roles } from "@/app/entity/Roles";

class BranchClass {
    private branchId?: number;

    constructor(branchId?: number) {
        this.branchId = branchId;
    }

    // Create a new branch
    async createBranch(branchData: Partial<Branch>) {
        const branchRepository = AppDataSource.getRepository(Branch);
        const newBranch = branchRepository.create(branchData);
        return await branchRepository.save(newBranch);
    }

    // Get branch by ID with relations
    async getBranchById() {
        if (!this.branchId) throw new Error("Branch ID is required");
        
        return await AppDataSource.getRepository(Branch)
            .createQueryBuilder("branch")
            .leftJoinAndSelect("branch.buisness", "business")
            .leftJoinAndSelect("branch.roles", "roles")
            .where("branch.id = :id", { id: this.branchId })
            .getOne();
    }

    // Update branch
    async updateBranch(updateData: Partial<Branch>) {
        if (!this.branchId) throw new Error("Branch ID is required");
        
        const branchRepository = AppDataSource.getRepository(Branch);
        await branchRepository.update(this.branchId, updateData);
        return await this.getBranchById();
    }

    // Delete branch
    async deleteBranch() {
        if (!this.branchId) throw new Error("Branch ID is required");
        
        const branchRepository = AppDataSource.getRepository(Branch);
        return await branchRepository.delete(this.branchId);
    }

    // Get all branches for a business
    async getBusinessBranches(businessId: number) {
        return await AppDataSource.getRepository(Branch)
            .createQueryBuilder("branch")
            .leftJoinAndSelect("branch.buisness", "business")
            .leftJoinAndSelect("branch.roles", "roles")
            .where("branch.buisnessId = :businessId", { businessId })
            .getMany();
    }

    // Get branch with business details
    async getBranchWithBusiness() {
        if (!this.branchId) throw new Error("Branch ID is required");
        
        return await AppDataSource.getRepository(Branch)
            .createQueryBuilder("branch")
            .leftJoinAndSelect("branch.buisness", "business")
            .where("branch.id = :id", { id: this.branchId })
            .getOne();
    }

    // Get branch roles
    async getBranchRoles() {
        if (!this.branchId) throw new Error("Branch ID is required");
        
        return await AppDataSource.getRepository(Branch)
            .createQueryBuilder("branch")
            .leftJoinAndSelect("branch.roles", "roles")
            .leftJoinAndSelect("roles.permissions", "permissions")
            .where("branch.id = :id", { id: this.branchId })
            .getOne();
    }

    // Assign roles to branch
    async assignRolesToBranch(roleIds: number[]) {
        if (!this.branchId) throw new Error("Branch ID is required");
        
        const branchRepository = AppDataSource.getRepository(Branch);
        const roleRepository = AppDataSource.getRepository(Roles);
        
        const branch = await this.getBranchById();
        if (!branch) throw new Error("Branch not found");
        
        const roles = await roleRepository.findByIds(roleIds);
        branch.roles = roles;
        return await branchRepository.save(branch);
    }

    // Search branches
    async searchBranches(searchTerm: string, businessId?: number) {
        const query = AppDataSource.getRepository(Branch)
            .createQueryBuilder("branch")
            .leftJoinAndSelect("branch.buisness", "business")
            .where("branch.name LIKE :searchTerm OR branch.address LIKE :searchTerm", 
                { searchTerm: `%${searchTerm}%` });

        if (businessId) {
            query.andWhere("branch.buisnessId = :businessId", { businessId });
        }

        return await query.getMany();
    }

    // Get branch statistics
    async getBranchStats() {
        if (!this.branchId) throw new Error("Branch ID is required");
        
        const branch = await this.getBranchById();
        if (!branch) throw new Error("Branch not found");

        const [userCount, roleCount] = await Promise.all([
            AppDataSource.getRepository(Users)
                .createQueryBuilder("user")
                .leftJoin("user.role", "role")
                .leftJoin("role.branch", "branch")
                .where("branch.id = :branchId", { branchId: this.branchId })
                .getCount(),
            AppDataSource.getRepository(Roles)
                .createQueryBuilder("role")
                .leftJoin("role.branch", "branch")
                .where("branch.id = :branchId", { branchId: this.branchId })
                .getCount()
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