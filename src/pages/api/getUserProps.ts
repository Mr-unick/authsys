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

      if (user?.business != null) {
        usersData = await prisma.user.findMany({
          where: {
            business_id: user.business,
            deleted_at: null
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true }
                }
              }
            },
            business: true
          }
        });
      } else {
        usersData = await prisma.user.findMany({
          where: {
            deleted_at: null
          },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true }
                }
              }
            },
            business: true
          }
        });
      }

      const tablerows = usersData.map((data: any) => ({
        id: data.id,
        name: data.name,
        role: data.role?.name ?? '-',
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
      const { name, password, email, role, business: businessId } = req.body;

      if (!name || !password || !email) {
        return res.status(400).json({
          message: "Name, password, and email are required",
          data: [],
          status: 400,
        });
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
          business_id: Number(businessId || user.business),
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

  if (req.method === "DELETE") {
    try {
      const id = req.query.id as string;
      if (!id) {
        return res.status(400).json({ message: "User ID is required", data: [], status: 400 });
      }

      await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          deleted_at: new Date()
        }
      });

      const response: ResponseInstance = {
        message: "User deleted successfully",
        data: [],
        status: 200,
      };

      return res.status(200).json(response);
    } catch (e: any) {
      const response: ResponseInstance = {
        message: "Something went wrong while deleting user",
        data: [e.message],
        status: 500,
      };
      return res.status(500).json(response);
    }
  }

  // ---- SOFT DELETE ----
  if (req.query.delete) {
    try {
      const ids = req.body.leads?.map((item: any) => item.id);
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
