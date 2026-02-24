import prisma from "@/app/lib/prisma";
import { Role } from "@prisma/client";

class RoleClass {
    private roleId?: number;

    constructor(roleId?: number) {
        this.roleId = roleId;
    }

    // Create a new role
    async createRole(roleData: any) {
        return await prisma.role.create({
            data: roleData
        });
    }

    // Get role by ID with relations
    async getRoleById() {
        if (!this.roleId) throw new Error("Role ID is required");

        return await prisma.role.findUnique({
            where: { id: this.roleId },
            include: {
                users: true,
                rolePermissions: {
                    include: { permission: true }
                },
                business: true
            }
        });
    }

    // Update role
    async updateRole(updateData: any) {
        if (!this.roleId) throw new Error("Role ID is required");

        await prisma.role.update({
            where: { id: this.roleId },
            data: updateData
        });
        return await this.getRoleById();
    }

    // Delete role
    async deleteRole() {
        if (!this.roleId) throw new Error("Role ID is required");

        return await prisma.role.delete({
            where: { id: this.roleId }
        });
    }

    // Get all roles for a business
    async getBusinessRoles(businessId: number) {
        return await prisma.role.findMany({
            where: { business_id: businessId },
            include: {
                rolePermissions: {
                    include: { permission: true }
                }
            }
        });
    }

    // Assign permissions to role
    async assignPermissionsToRole(permissionIds: number[]) {
        if (!this.roleId) throw new Error("Role ID is required");

        // Explicit join: delete existing, then create new entries
        await prisma.rolePermission.deleteMany({
            where: { role_id: this.roleId }
        });

        await prisma.rolePermission.createMany({
            data: permissionIds.map(pid => ({
                role_id: this.roleId!,
                permission_id: pid
            }))
        });

        return await prisma.role.findUnique({
            where: { id: this.roleId },
            include: {
                rolePermissions: {
                    include: { permission: true }
                }
            }
        });
    }

    // Get all users with this role
    async getRoleUsers() {
        if (!this.roleId) throw new Error("Role ID is required");

        return await prisma.role.findUnique({
            where: { id: this.roleId },
            include: {
                users: true
            }
        });
    }

    // Get all permissions for this role
    async getRolePermissions() {
        if (!this.roleId) throw new Error("Role ID is required");

        return await prisma.role.findUnique({
            where: { id: this.roleId },
            include: {
                rolePermissions: {
                    include: { permission: true }
                }
            }
        });
    }
}

export default RoleClass; 