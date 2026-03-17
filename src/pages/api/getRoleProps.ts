import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import fs from 'fs';

export default async function handler(req: any, res: any) {
  console.log('API REQUEST:', req.method, req.url, 'TOKEN PRESENT:', !!req.cookies?.token);
  const user = await VerifyToken(req, res, 'roles');
  if (res.writableEnded) return;

  if (req.method === "GET") {
    try {
      const { id } = req.query;

      if (id) {
        const role = await prisma.role.findUnique({
          where: { id: Number(id), deleted_at: null },
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            },
            branch: true
          }
        });

        if (!role) {
          return res.status(404).json({ message: "Role not found", status: 404 });
        }

        return res.status(200).json({
          message: "Request successful",
          data: {
            ...role,
            permissionIds: role.rolePermissions.map(rp => rp.permission_id)
          },
          status: 200,
        });
      }

      const branchId = user.branch;
      const whereClause: any = {
        business_id: user.business || null,
        deleted_at: null,
        // Scoping
        ...(branchId ? { branch_id: Number(branchId) } : {}),
        // If not super admin, hide the administrative roles
        ...(user.role !== 'SUPER_ADMIN' ? {
          NOT: {
            name: { in: ['Buisness Admin', 'Business Admin', 'Admin', 'Super Admin', 'SuperAdmin'] }
          }
        } : {})
      };

      const rolesData = await prisma.role.findMany({
        where: whereClause,
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      });

      const tablerows = rolesData.map((data: any) => ({
        id: data.id,
        name: data.name,
        permissions: data.rolePermissions?.map((rp: any) => rp.permission?.permission).filter(Boolean) || []
      }));

      const tabledata = new GenerateTable({
        name: "Roles",
        data: tablerows,
      }).policy(user, 'roles').addform('roleform').formtype('page').gettable();

      const response: ResponseInstance = {
        message: "Request successful",
        data: tabledata,
        status: 200,
      };

      return res.status(200).json(response);
    } catch (e: any) {
      console.error("[getRoleProps GET ERROR]", e);
      fs.appendFileSync('roles_api_error.txt', `[${new Date().toISOString()}] GET ERROR: ${e.stack}\nUser: ${JSON.stringify(user)}\n`);
      return res.status(500).json({
        message: "Something went wrong fetching roles",
        data: [e.message],
        status: 500,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, permissions, branch } = req.body;
      console.log("[getRoleProps POST] Request body:", req.body);

      if (!name) {
        return res.status(400).json({
          message: "Role name is required",
          data: [],
          status: 400,
        });
      }

      // Prevent non-SuperAdmins from hijacking the Business Admin identity
      const protectedNames = ['BUISNESS ADMIN', 'BUSINESS ADMIN', 'ADMIN', 'SUPER ADMIN', 'SUPER_ADMIN'];
      const normalizedInputName = name.trim().toUpperCase().replace(/\s+/g, ' ');
      if (user.role !== 'SUPER_ADMIN' && protectedNames.includes(normalizedInputName)) {
        return res.status(403).json({
          message: "Unauthorized: You cannot create a role with this administrative name",
          status: 403
        });
      }

      const newRole = await prisma.$transaction(async (tx) => {
        const role = await tx.role.create({
          data: {
            name: name,
            business_id: user.business || null,
            branch_id: user.is_branch_admin ? Number(user.branch) : (branch && branch !== "0" && branch !== 0 ? Number(branch) : null),
            created_at: new Date()
          }
        });

        if (Array.isArray(permissions) && permissions.length > 0) {
          // Filter out invalid IDs
          const validPermissionIds = permissions
            .map((id: any) => Number(id))
            .filter((id: number) => !isNaN(id) && id > 0);

          if (validPermissionIds.length > 0) {
            await tx.rolePermission.createMany({
              data: validPermissionIds.map((id: number) => ({
                role_id: role.id,
                permission_id: id
              }))
            });
          }
        }

        return role;
      });

      console.log("[getRoleProps POST] Successfully created role:", newRole.id);

      return res.status(201).json({
        message: "Role created successfully",
        data: newRole,
        status: 201,
      });
    } catch (e: any) {
      console.error("[getRoleProps POST ERROR]", e);
      fs.appendFileSync('roles_post_error.txt', `[${new Date().toISOString()}] POST ERROR: ${e.stack}\nBody: ${JSON.stringify(req.body)}\nUser: ${JSON.stringify(user)}\n`);
      return res.status(500).json({
        message: "Something went wrong while creating role",
        data: [e.message],
        status: 500,
      });
    }
  }


  // Handle PUT for updating roles if needed (based on GenerateTable pattern)
  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { name, permissions } = req.body;

      if (!id) return res.status(400).json({ message: "ID required" });

      const existingRole = await prisma.role.findUnique({ where: { id: Number(id) } });
      if (!existingRole) return res.status(404).json({ message: "Role not found" });

      const protectedNames = ['BUISNESS ADMIN', 'BUSINESS ADMIN', 'ADMIN'];
      const isTargetProtected = protectedNames.includes(existingRole.name.trim().toUpperCase().replace(/\s+/g, ' '));
      const isNewNameProtected = name && protectedNames.includes(name.trim().toUpperCase().replace(/\s+/g, ' '));

      if (user.role !== 'SUPER_ADMIN' && (isTargetProtected || isNewNameProtected)) {
        return res.status(403).json({
          message: "Unauthorized: Access to this administrative role is restricted to Portal Staff",
          status: 403
        });
      }

      await prisma.$transaction(async (tx) => {
        if (name) {
          await tx.role.update({
            where: { id: Number(id) },
            data: { name, updated_at: new Date() }
          });
        }

        if (permissions) {
          await tx.rolePermission.deleteMany({ where: { role_id: Number(id) } });
          if (permissions.length > 0) {
            await tx.rolePermission.createMany({
              data: permissions.map((pId: any) => ({
                role_id: Number(id),
                permission_id: Number(pId)
              }))
            });
          }
        }
      });

      return res.status(200).json({ message: "Role updated successfully", status: 200 });
    } catch (e: any) {
      return res.status(500).json({ message: e.message, status: 500 });
    }
  }

  // ---- SOFT DELETE ----
  if (req.method === "DELETE" || req.query.delete) {
    try {
      const rowData = req.body.leads || req.body.data || (req.query.id ? [{ id: Number(req.query.id) }] : []);
      const ids = rowData?.map((item: any) => item.id);
      if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "No records specified for deletion", data: [], status: 400 });
      }

      await prisma.role.updateMany({
        where: { id: { in: ids } },
        data: { deleted_at: new Date() }
      });

      return res.status(200).json({
        message: "Deleted successfully",
        data: [],
        status: 200,
      });
    } catch (e: any) {
      return res.status(500).json({ message: "Deletion failed", data: [e.message], status: 500 });
    }
  }

  return res.status(405).json({ message: "Method not allowed", data: [], status: 405 });
}
