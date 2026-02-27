import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, 'leadstages');
  if (res.writableEnded) return;

  if (req.method === "GET") {
    try {
      const businessId = user.business;

      // Strict tenant isolation: require businessId unless platform admin (who might be viewing specific context)
      // For now, if no businessId, we return empty as stages MUST belong to a business
      if (!businessId && user.role !== 'SUPER_ADMIN') {
        return res.status(200).json({ status: 200, data: { rows: [] }, message: "No business context" });
      }

      const stages = await (prisma as any).leadStage.findMany({
        where: {
          business_id: businessId || undefined,
          deleted_at: null
        },
        orderBy: { order: 'asc' }
      });

      const tablerows = stages.map((stage: any) => ({
        id: stage.id,
        name: stage.stage_name,
        colour: stage.colour,
        order: stage.order,
        type: stage.stage_type,
      }));

      const tabledata = new GenerateTable({
        name: "Lead Stages",
        data: tablerows,
      }).policy(user, 'leadstages').addform('leadstageform').gettable();

      const response: ResponseInstance = {
        message: "Success",
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
      const { stage_name, discription, colour, order, stage_type } = req.body;
      const businessId = user.business;

      if (!businessId) {
        return res.status(400).json({ message: "Business ID is required to create a stage", status: 400 });
      }

      if (!stage_name) {
        return res.status(400).json({
          message: "Stage name is required",
          data: [],
          status: 400,
        });
      }

      await (prisma as any).leadStage.create({
        data: {
          stage_name,
          discription,
          colour,
          order: order ? Number(order) : 0,
          stage_type: stage_type || 'ONGOING',
          business_id: businessId
        }
      });

      return res.status(201).json({
        message: "Stage created successfully",
        data: [],
        status: 201,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong",
        data: [error.message],
        status: 500,
      });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { stage_name, discription, colour, order, stage_type } = req.body;
      const businessId = user.business;

      if (!id) {
        return res.status(400).json({ message: "Stage ID is required", status: 400 });
      }

      // Verify ownership before update
      const existing = await (prisma as any).leadStage.findFirst({
        where: {
          id: Number(id),
          business_id: businessId || undefined
        }
      });

      if (!existing && user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: "Unauthorized to update this stage", status: 403 });
      }

      await (prisma as any).leadStage.update({
        where: { id: Number(id) },
        data: {
          stage_name,
          discription,
          colour,
          order: order ? Number(order) : 0,
          stage_type: stage_type,
        }
      });

      return res.status(200).json({
        message: "Stage updated successfully",
        data: [],
        status: 200,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong while updating stage",
        data: [error.message],
        status: 500,
      });
    }
  }

  // ---- SOFT DELETE ----
  if (req.query.delete) {
    try {
      const ids = req.body.leads?.map((item: any) => item.id);
      const businessId = user.business;

      if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "No records specified for deletion", data: [], status: 400 });
      }

      // Super Admins can delete anything, others only their own business stages
      const where: any = { id: { in: ids } };
      if (user.role !== 'SUPER_ADMIN') {
        where.business_id = businessId;
      }

      await (prisma as any).leadStage.updateMany({
        where: where,
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