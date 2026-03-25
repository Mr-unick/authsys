import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import fs from 'fs';

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, 'stages');
  if (res.writableEnded) return;

  if (req.method === "GET") {
    try {
      const businessId = user.business;
      const branchId = user.branch;

      // Strict tenant isolation: require businessId unless platform admin
      if (!businessId && user.role !== 'SUPER_ADMIN') {
        return res.status(200).json({ status: 200, data: { rows: [] }, message: "No business context" });
      }

      const whereClause: any = {
        business_id: businessId || undefined,
        deleted_at: null
      };

      // Branch Isolation
      if (branchId) {
        whereClause.branch_id = branchId;
      }

      const stages = await (prisma as any).leadStage.findMany({
        where: whereClause,
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
      }).policy(user, 'stage').addform('leadstageform').gettable();

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
      const { stage_name, discription, colour, order, stage_type, branch } = req.body;
      const businessId = user.business;

      if (!businessId) {
        return res.status(400).json({ message: "Business ID is required to create a stage", status: 400 });
      }

      const business = await (prisma as any).business.findUnique({
        where: { id: businessId }
      });

      const stageCount = await (prisma as any).leadStage.count({
        where: { business_id: businessId, deleted_at: null }
      });

      if (business && business.max_lead_stages > 0 && stageCount >= business.max_lead_stages) {
        return res.status(403).json({
          message: `Lead stage limit reached. Your subscription allows up to ${business.max_lead_stages} stages.`,
          data: [],
          status: 403,
        });
      }

      if (!stage_name) {
        return res.status(400).json({
          message: "Stage name is required",
          data: [],
          status: 400,
        });
      }

      const newStage = await (prisma as any).leadStage.create({
        data: {
          stage_name,
          discription,
          colour: colour || '#3B82F6',
          order: isNaN(parseInt(order)) ? 0 : parseInt(order),
          stage_type: stage_type || 'ONGOING',
          business_id: businessId,
          branch_id: branch && Number(branch) > 0 ? Number(branch) : null
        }
      });

      return res.status(201).json({
        message: "Stage created successfully",
        data: newStage,
        status: 201,
      });
    } catch (error: any) {
      console.error("[getLeadStagesProps POST ERROR]:", error);
      fs.appendFileSync('stage_post_error.txt', `[${new Date().toISOString()}] POST ERROR: ${error.stack}\nBody: ${JSON.stringify(req.body)}\nUser: ${JSON.stringify(user)}\n`);
      return res.status(500).json({
        message: "Something went wrong while creating stage",
        data: [error.message],
        status: 500,
      });
    }

  }

  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { stage_name, discription, colour, order, stage_type, branch } = req.body;
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
          branch_id: branch && Number(branch) > 0 ? Number(branch) : null
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
  if (req.method === "DELETE" || req.query.delete) {
    try {
      const rowData = req.body.leads || req.body.data || (req.query.id ? [{ id: Number(req.query.id) }] : []);
      const ids = rowData?.map((item: any) => item.id);
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