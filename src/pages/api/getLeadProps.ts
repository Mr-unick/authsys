import prisma from "@/app/lib/prisma";
import { ResponseInstance } from "../../utils/instances";
import { GenerateTable } from "../../utils/generateTable";
import { VerifyToken } from "@/utils/VerifyToken";
import LeadClass from "./classes/leadclass";
import { getPagination } from "@/utils/utility";

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, 'leads');
  if (res.writableEnded) return;

  const { id } = req.query;

  // ---- CREATE ----
  if (req.method === "POST" && !req.query.delete) {
    try {
      const { name, email, phone, stage, business: businessId } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required", data: [], status: 400 });
      }

      const targetBusinessId = businessId || user.business;
      const targetBranchId = req.body.branch ? Number(req.body.branch) : (user.branch || null);

      const newLead = await prisma.$transaction(async (tx) => {
        const lead = await tx.lead.create({
          data: {
            name,
            email,
            phone: phone || null,
            lead_source: 'website',
            business_id: Number(targetBusinessId),
            branch_id: targetBranchId,
            stage_id: stage ? Number(stage) : undefined,
          }
        });

        // Link the creator as a collaborator
        await tx.leadUser.create({
          data: {
            lead_id: lead.id,
            user_id: user.id
          }
        });

        // Create initial stage change history
        await tx.stageChangeHistory.create({
          data: {
            lead_id: lead.id,
            stage_id: stage ? Number(stage) : null,
            reason: "Lead created",
            user_id: user.id,
          }
        });

        return lead;
      });

      return res.status(201).json({
        message: "Lead created successfully",
        data: newLead,
        status: 201,
      });
    } catch (e: any) {
      return res.status(500).json({ message: "Failed to create lead", data: [e.message], status: 500 });
    }
  }

  // ---- READ ----
  if (req.method === "GET") {
    try {
      let currentPage = parseInt(req.query.page) || 1;
      let perPage = parseInt(req.query.perpage) || 8;

      let whereClause: any = {
        business_id: user.business,
        deleted_at: null
      };

      // Multi-branch filtering
      if (user.branch) {
        whereClause.branch_id = user.branch;
      }

      // Role-based filtering
      const isAdminRole = ['ADMIN', 'BUSINESS_ADMIN', 'BUISNESS_ADMIN', 'SUPER_ADMIN'].includes(user.role?.toUpperCase());
      const isBranchBoss = user.role === 'BRANCH_ADMIN';

      if (isAdminRole && !user.branch) {
        // Global Business Admin/Super Admin sees all leads
      } else if (isBranchBoss) {
        // Branch Admin sees all leads within THEIR branch (already filtered by whereClause.branch_id)
      } else {
        // Regular user sees only their assigned leads
        whereClause.leadUsers = {
          some: {
            user_id: user.id
          }
        };
      }

      const totalRows = await prisma.lead.count({ where: whereClause });

      const leadsRows = await prisma.lead.findMany({
        where: whereClause,
        include: {
          leadUsers: { include: { user: true } },
          stage: true
        },
        skip: (currentPage - 1) * perPage,
        take: perPage,
        orderBy: {
          created_at: 'desc'
        }
      });

      const leads = leadsRows.map((data: any) => {
        const collaborators = data?.leadUsers?.map((lu: any) => lu.user?.name) || [];

        return {
          id: data.id,
          name: data?.name || '-',
          email: data?.email || '-',
          address: data?.address || '-',
          phone: data?.phone || '-',
          second_phone: data?.second_phone || '-',
          status: data?.status || '-',
          stage: data?.stage?.stage_name || '-',
          collaborators,
          lead_source: data?.lead_source || '-',
          notes: data?.notes || '-',
        };
      });

      const tabledata = new GenerateTable({
        name: "Leads",
        data: leads,
      }).policy(user, 'leads')
        .addform('leadform')
        .addPagination(getPagination(currentPage, perPage, totalRows))
        .gettable();

      const response: ResponseInstance = {
        message: "Request successful",
        data: { ...tabledata, upload: true },
        status: 200,
      };

      return res.status(200).json(response);
    } catch (e: any) {
      return res.status(500).json({ message: "Failed to fetch leads", data: [e.message], status: 500 });
    }
  }

  // ---- UPDATE ----
  if (req.method === "PUT") {
    try {
      if (!id) {
        return res.status(400).json({ message: "Lead ID is required", data: [], status: 400 });
      }

      const leadClass = new LeadClass(parseInt(id as string));
      const lead = await leadClass.updateLead(req.body);

      return res.status(200).json({
        message: "Updated successfully",
        data: [lead],
        status: 200,
      });
    } catch (e: any) {
      return res.status(500).json({ message: "Update failed", data: [e.message], status: 500 });
    }
  }

  // ---- SOFT DELETE ----
  if (req.query.delete) {
    try {
      const ids = req.body.leads?.map((lead: any) => lead.id);

      if (!ids || ids.length === 0) {
        return res.status(400).json({ message: "No leads specified for deletion", data: [], status: 400 });
      }

      await prisma.lead.updateMany({
        where: {
          id: { in: ids }
        },
        data: {
          deleted_at: new Date()
        }
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
