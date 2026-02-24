import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, 'leadstages');
  if (res.writableEnded) return;

  if (req.method === "GET") {
    try {
      let stages;

      if (user?.business) {
        stages = await prisma.leadStage.findMany({
          where: { business_id: user.business },
          orderBy: { order: 'asc' }
        });
      } else {
        stages = await prisma.leadStage.findMany({
          orderBy: { order: 'asc' }
        });
      }

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

      if (!stage_name) {
        return res.status(400).json({
          message: "Stage name is required",
          data: [],
          status: 400,
        });
      }

      await prisma.leadStage.create({
        data: {
          stage_name,
          discription,
          colour,
          order: order ? Number(order) : 0,
          stage_type: stage_type || 'ONGOING',
          business_id: user?.business
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

      if (!id) {
        return res.status(400).json({ message: "Stage ID is required", status: 400 });
      }

      await prisma.leadStage.update({
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
      if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "No records specified for deletion", data: [], status: 400 });
      }

      await prisma.leadStage.updateMany({
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