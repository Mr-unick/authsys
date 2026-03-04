import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import bcrypt from "bcryptjs";

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, 'users');
  if (res.writableEnded) return;

  if (req.method === "GET") {
    try {
      let usersData;
      const branchId = user.branch;
      const isBranchAdmin = user.is_branch_admin;

      const whereClause: any = { deleted_at: null };
      if (user?.business != null) {
        whereClause.business_id = user.business;
        // Scoping: If Branch Admin or scoped user, only see their branch
        if (branchId) {
          whereClause.branch_id = branchId;
        }
      }

      usersData = await prisma.user.findMany({
        where: whereClause,
        include: {
          role: {
            include: {
              rolePermissions: {
                include: { permission: true }
              }
            }
          },
          business: true,
          branch: true
        }
      });

      const tablerows = usersData.map((data: any) => ({
        id: data.id,
        name: data.name,
        role: data.role?.name ?? '-',
        branch: data.branch?.name ?? (data.business_id ? 'Main / Unassigned' : '-'),
        is_manager: data.is_branch_admin ? 'Yes' : 'No'
      }));

      const tabledata = new GenerateTable({
        name: "User",
        data: tablerows,
      });

      const response: ResponseInstance = {
        message: "Request successful",
        data: tabledata.policy(user, 'users').addform('userform').gettable(),
        status: 200,
      };

      return res.status(200).json(response);
    } catch (e: any) {
      const response: ResponseInstance = {
        message: "Something went wrong",
        data: [e.message],
        status: 500,
      };
      return res.status(500).json(response);
    }
  }

  if (req.method === "POST") {
    try {
      const { name, password, email, role, business: businessId, branch, is_branch_admin } = req.body;

      if (!name || !password || !email) {
        return res.status(400).json({
          message: "Name, password, and email are required",
          data: [],
          status: 400,
        });
      }

      const targetBusinessId = Number(businessId || user.business);
      // Logic for Branch Admin: Force all created users to their branch
      const targetBranchId = user.is_branch_admin ? user.branch : (branch ? Number(branch) : null);
      const isBranchManager = user.is_branch_admin ? false : (is_branch_admin === true || is_branch_admin === "true");

      // 1. Enforcement: Check max_users_per_branch limit
      if (targetBranchId) {
        const business = await prisma.business.findUnique({
          where: { id: targetBusinessId }
        });

        const currentBranchUserCount = await prisma.user.count({
          where: { branch_id: targetBranchId, deleted_at: null }
        });

        if (business && business.max_users_per_branch > 0 && currentBranchUserCount >= business.max_users_per_branch) {
          return res.status(403).json({
            message: `User limit reached for this branch. Max allowed: ${business.max_users_per_branch}`,
            status: 403
          });
        }
      }

      // 2. Enforcement: Only ONE Branch Admin per branch
      if (isBranchManager && targetBranchId) {
        const existingManager = await prisma.user.findFirst({
          where: {
            branch_id: targetBranchId,
            is_branch_admin: true,
            deleted_at: null
          }
        });
        if (existingManager) {
          return res.status(400).json({
            message: "There can only be one Branch Manager per branch.",
            status: 400
          });
        }
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const targetRoleId = role ? Number(role) : null;

      // Security Check: Non-SuperAdmins cannot create other Business Admins
      if (user.role !== 'SUPER_ADMIN' && targetRoleId) {
        const targetRole = await prisma.role.findUnique({ where: { id: targetRoleId } });
        const protectedNames = ['BUISNESS ADMIN', 'BUSINESS ADMIN', 'ADMIN'];
        if (targetRole && protectedNames.includes(targetRole.name.trim().toUpperCase().replace(/\s+/g, ' '))) {
          return res.status(403).json({
            message: "Unauthorized: You do not have permission to assign this administrative role",
            status: 403
          });
        }
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
          email,
          role_id: targetRoleId,
          business_id: targetBusinessId,
          branch_id: targetBranchId,
          is_branch_admin: isBranchManager,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      const response: ResponseInstance = {
        message: "User created successfully",
        data: [],
        status: 201,
      };

      return res.status(201).json(response);
    } catch (e: any) {
      const response: ResponseInstance = {
        message: "Something went wrong while creating user",
        data: [e.message],
        status: 500,
      };
      return res.status(500).json(response);
    }
  }

  if (req.method === "PUT") {
    try {
      const { id, name, password, new_password, email, role, branch, is_branch_admin } = req.body;
      const userId = Number(id || req.query.id);

      const targetBranchId = branch ? Number(branch) : null;
      const isBranchManager = is_branch_admin === true || is_branch_admin === "true";

      // Enforcement: Only ONE Branch Admin per branch
      if (isBranchManager && targetBranchId) {
        const existingManager = await prisma.user.findFirst({
          where: {
            branch_id: targetBranchId,
            is_branch_admin: true,
            deleted_at: null,
            NOT: { id: userId }
          }
        });
        if (existingManager) {
          return res.status(400).json({
            message: "There can only be one Branch Manager per branch.",
            status: 400
          });
        }
      }

      const updateData: any = {
        name,
        email,
        role_id: role ? Number(role) : undefined,
        branch_id: targetBranchId,
        is_branch_admin: isBranchManager,
        updated_at: new Date()
      };

      if (new_password) {
        updateData.password = bcrypt.hashSync(new_password, 10);
      }

      await prisma.user.update({
        where: { id: userId },
        data: updateData
      });

      return res.status(200).json({ message: "User updated successfully", status: 200 });
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

      await prisma.user.updateMany({
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
