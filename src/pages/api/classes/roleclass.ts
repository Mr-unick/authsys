import { AppDataSource } from "@/app/lib/data-source";
import { Roles } from "@/app/entity/Roles";
import { Permissions } from "@/app/entity/Permissions";
import { Business } from "@/app/entity/Business";
import { Users } from "@/app/entity/Users";

class RoleClass {
    private roleId?: number;

    constructor(roleId?: number) {
        this.roleId = roleId;
    }

    // Create a new role
    async createRole(roleData: Partial<Roles>) {
        const roleRepository = AppDataSource.getRepository(Roles);
        const newRole = roleRepository.create(roleData);
        return await roleRepository.save(newRole);
    }

    // Get role by ID with relations
    async getRoleById() {
        if (!this.roleId) throw new Error("Role ID is required");
        
        return await AppDataSource.getRepository(Roles)
            .createQueryBuilder("role")
            .leftJoinAndSelect("role.users", "users")
            .leftJoinAndSelect("role.permissions", "permissions")
            .leftJoinAndSelect("role.buisness", "business")
            .where("role.id = :id", { id: this.roleId })
            .getOne();
    }

    // Update role
    async updateRole(updateData: Partial<Roles>) {
        if (!this.roleId) throw new Error("Role ID is required");
        
        const roleRepository = AppDataSource.getRepository(Roles);
        await roleRepository.update(this.roleId, updateData);
        return await this.getRoleById();
    }

    // Delete role
    async deleteRole() {
        if (!this.roleId) throw new Error("Role ID is required");
        
        const roleRepository = AppDataSource.getRepository(Roles);
        return await roleRepository.delete(this.roleId);
    }

    // Get all roles for a business
    async getBusinessRoles(businessId: number) {
        return await AppDataSource.getRepository(Roles)
            .createQueryBuilder("role")
            .leftJoinAndSelect("role.permissions", "permissions")
            .where("role.buisnesId = :businessId", { businessId })
            .getMany();
    }

    // Assign permissions to role
    async assignPermissionsToRole(permissionIds: number[]) {
        if (!this.roleId) throw new Error("Role ID is required");
        
        const roleRepository = AppDataSource.getRepository(Roles);
        const permissionRepository = AppDataSource.getRepository(Permissions);
        
        const role = await this.getRoleById();
        if (!role) throw new Error("Role not found");
        
        const permissions = await permissionRepository.findByIds(permissionIds);
        role.permissions = permissions;
        return await roleRepository.save(role);
    }

    // Get all users with this role
    async getRoleUsers() {
        if (!this.roleId) throw new Error("Role ID is required");
        
        return await AppDataSource.getRepository(Roles)
            .createQueryBuilder("role")
            .leftJoinAndSelect("role.users", "users")
            .where("role.id = :id", { id: this.roleId })
            .getOne();
    }

    // Get all permissions for this role
    async getRolePermissions() {
        if (!this.roleId) throw new Error("Role ID is required");
        
        return await AppDataSource.getRepository(Roles)
            .createQueryBuilder("role")
            .leftJoinAndSelect("role.permissions", "permissions")
            .where("role.id = :id", { id: this.roleId })
            .getOne();
    }
}

export default RoleClass; 