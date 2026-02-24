import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, 'roles');
  if (res.writableEnded) return;

  if (req.method === "GET") {
    try {
      const rolesData = await prisma.role.findMany({
        where: { business_id: user.business }
      });

      const tablerows = rolesData.map((data: any) => ({
        id: data.id,
        name: data.name,
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

      const newRole = await prisma.$transaction(async (tx) => {
        const role = await tx.role.create({
          data: {
            name: name,
            business_id: user.business,
            branch_id: branch ? Number(branch) : null,
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

  // ---- SOFT DELETE ----
  if (req.query.delete) {
    try {
      const ids = req.body.leads?.map((item: any) => item.id);
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
