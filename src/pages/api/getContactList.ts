import prisma from "@/app/lib/prisma";
import { ResponseInstance } from "../../utils/instances";
import { GenerateTable } from "../../utils/generateTable";
import { VerifyToken } from "@/utils/VerifyToken";
import LeadClass from "./classes/leadclass";

export default async function handler(req: any, res: any) {
  let user = await VerifyToken(req, res, 'leads');
  if (res.writableEnded) return;

  const { id } = req.query;

  if (req.method == "POST" && !req.query.delete) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        const newLead = await tx.lead.create({
          data: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            lead_source: 'website',
            business_id: req.body.business || 1,
            stage_id: req.body.stage,
          }
        });

        await tx.leadUser.create({
          data: {
            lead_id: newLead.id,
            user_id: 1 // Hardcoded ID 1 as per original
          }
        });

        await tx.stageChangeHistory.create({
          data: {
            lead_id: newLead.id,
            stage_id: newLead.stage_id,
            reason: "Nothing Special",
            user_id: req.body.user || 1
          }
        });

        return newLead;
      });

      return res.json({ newLead: result });
    } catch (e: any) {
      return res.status(500).json({ message: "Failed to create lead", error: e.message });
    }
  }

  if (req.method == "GET") {
    try {
      let whereClause: any = {
        business_id: user.business,
        deleted_at: null
      };

      if (user.role === 'Buisness Admin') {
        whereClause.leadUsers = { some: {} };
      } else if (user.role !== 'Admin') {
        whereClause.leadUsers = { some: { user_id: user.id } };
      }

      const leadRows = await prisma.lead.findMany({
        where: whereClause,
        include: {
          leadUsers: { include: { user: true } },
          stage: true
        }
      });

      const leads = leadRows.map((data: any) => ({
        id: data.id,
        name: data?.name || '-',
        email: data?.email || '-',
        phone: data?.phone || '-',
      }));

      const tabledata = new GenerateTable({
        name: "Leads",
        data: leads,
      }).policy(user, 'leads').addform('leadform').gettable();

      const response: ResponseInstance = {
        message: "Request successful",
        data: {
          ...tabledata,
          upload: true
        },
        status: 200,
      };

      return res.json(response);
    } catch (e: any) {
      return res.status(500).json({ message: "Failed to fetch leads", error: e.message });
    }
  }

  if (req.method == "PUT") {
    try {
      const leadclass = new LeadClass(parseInt(id as string));
      const lead = await leadclass.updateLead(req.body);

      const response: ResponseInstance = {
        message: " Updated successfully",
        data: [lead],
        status: 200,
      };

      return res.json(response);
    } catch (e: any) {
      const response: ResponseInstance = {
        message: "Request Failed",
        data: [e.message],
        status: 400,
      };

      return res.json(response);
    }
  }

  if (req.query.delete) {
    try {
      const ids = req.body.leads.map((l: any) => l.id);

      await prisma.lead.updateMany({
        where: { id: { in: ids } },
        data: { deleted_at: new Date() }
      });

      const response: ResponseInstance = {
        message: "Deleted successfully",
        data: [],
        status: 200,
      };

      return res.json(response);
    } catch (e: any) {
      const response: ResponseInstance = {
        message: "Request Failed",
        data: [e.message],
        status: 400,
      };

      return res.json(response);
    }
  }

  return res.status(405).json({ message: "Method not allowed", status: 405 });
}



