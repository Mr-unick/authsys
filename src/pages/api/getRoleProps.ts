import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import fs from 'fs';

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, 'roles');
  if (res.writableEnded) return;

  if (req.method === "GET") {
    try {
      const branchId = user.branch;
      const whereClause: any = {
        business_id: user.business,
        deleted_at: null,
        // Scoping
        ...(branchId ? { branch_id: branchId } : {}),
        // If not super admin, hidden the 'Buisness Admin' role
        ...(user.role !== 'SUPER_ADMIN' ? {
          NOT: {
            name: { in: ['Buisness Admin', 'Business Admin', 'Admin'] }
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
        permissions: data.rolePermissions.map((rp: any) => rp.permission.permission)
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
      fs.appendFileSync('roles_api_error.txt', `[${new Date().toISOString()}] ERROR: User: ${user.email}, Role: ${user.role}, Biz: ${user.business}, Err: ${e.stack}\n`);
      return res.status(500).json({
        message: "Something went wrong",
        data: [e.message],
        status: 500,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, permissions, branch } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Role name is required",
          data: [],
          status: 400,
        });
      }

      // Prevent non-SuperAdmins from hijacking the Business Admin identity
      const protectedNames = ['BUISNESS ADMIN', 'BUSINESS ADMIN', 'ADMIN'];
      if (user.role !== 'SUPER_ADMIN' && protectedNames.includes(name.trim().toUpperCase().replace(/\s+/g, ' '))) {
        return res.status(403).json({
          message: "Unauthorized: You cannot create a role with this administrative name",
          status: 403
        });
      }

      const newRole = await prisma.$transaction(async (tx) => {
        const role = await tx.role.create({
          data: {
            name: name,
            business_id: user.business,
            branch_id: user.is_branch_admin ? user.branch : (branch ? Number(branch) : null),
            created_at: new Date()
          }
        });

        if (permissions?.length) {
          await tx.rolePermission.createMany({
            data: permissions.map((id: number | string) => ({
              role_id: role.id,
              permission_id: Number(id)
            }))
          });
        }

        return role;
      });

      return res.status(201).json({
        message: "Role created successfully",
        data: newRole,
        status: 201,
      });
    } catch (e: any) {
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
