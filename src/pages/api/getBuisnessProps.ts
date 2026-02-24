import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import bcrypt from "bcryptjs";

export default async function handler(req: any, res: any) {
  const user = await VerifyToken(req, res, 'business');
  if (res.writableEnded) return;

  if (req.method === "GET") {
    try {
      let businessData;

      if (user?.business) {
        businessData = await prisma.business.findMany({
          where: {
            id: user.business,
            deleted_at: null
          }
        });
      } else {
        businessData = await prisma.business.findMany({
          where: {
            deleted_at: null
          }
        });
      }

      const tablerows = businessData.map((data: any) => ({
        id: data.id,
        name: data.business_name,
        gst_number: data.gst_number,
        pan_number: data.pan_number,
        business_address: data.business_address,
        city: data.city,
        state: data.state,
        pin_code: data.pin_code,
        contact_number: data.contact_number,
        email: data.email,
        website: data.website,
        owner_name: data.owner_name,
        owner_contact: data.owner_contact,
        owner_email: data.owner_email,
        business_description: data.business_description,
      }));

      const tabledata = new GenerateTable({
        name: "Business",
        data: tablerows,
      }).policy(user, 'business').addform('buisnessform').gettable();

      return res.status(200).json({
        message: "Request successful",
        data: tabledata,
        status: 200,
      });
    } catch (e: any) {
      return res.status(500).json({
        message: "Something went wrong",
        data: [{ message: e.message }],
        status: 500,
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const id = req.query.id as string;
      if (!id) {
        return res.status(400).json({ message: "Business ID is required", data: [], status: 400 });
      }

      await prisma.business.update({
        where: { id: parseInt(id) },
        data: {
          deleted_at: new Date()
        }
      });

      return res.status(200).json({
        message: "Record deleted successfully",
        data: [],
        status: 200,
      });
    } catch (e: any) {
      return res.status(500).json({
        message: "Something went wrong while deleting record",
        data: [e.message],
        status: 500,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const {
        business_name, gst_number, pan_number, business_address,
        city, state, pin_code, contact_number, email, website,
        owner_name, owner_contact, owner_email, business_description,
      } = req.body;

      if (!business_name || !email) {
        return res.status(400).json({
          message: "Business name and email are required",
          data: [],
          status: 400,
        });
      }

      const result = await prisma.$transaction(async (tx) => {
        const newBusiness = await tx.business.create({
          data: {
            business_name,
            gst_number,
            pan_number,
            business_address,
            city,
            state,
            pin_code,
            contact_number,
            email,
            website,
            owner_name,
            owner_contact,
            owner_email,
            business_description,
            created_at: new Date(),
            updated_at: new Date()
          }
        });

        // Find Buisness Admin role
        const role = await tx.role.findFirst({
          where: { name: 'Buisness Admin' }
        });

        // Create business admin user
        await tx.user.create({
          data: {
            email: owner_email,
            name: owner_name,
            password: bcrypt.hashSync('Admin@123', 10),
            created_at: new Date(),
            updated_at: new Date(),
            business_id: newBusiness.id,
            role_id: role?.id || null
          }
        });

        // Create default stages
        await tx.leadStage.createMany({
          data: [
            {
              stage_name: 'Closed',
              colour: '#228b22', // ForestGreen
              order: 99,
              stage_type: 'WON',
              business_id: newBusiness.id,
              discription: 'Lead has been successfully closed and converted.'
            },
            {
              stage_name: 'Lost',
              colour: '#ff0000', // Red
              order: 100,
              stage_type: 'LOST',
              business_id: newBusiness.id,
              discription: 'Lead has been lost.'
            }
          ]
        });

        return newBusiness;
      });

      return res.status(201).json({
        message: "Business created successfully",
        data: result,
        status: 201,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong while creating business",
        data: [error.message],
        status: 500,
      });
    }
  }

  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "Business ID is required", status: 400 });
      }

      const updatedBusiness = await prisma.business.update({
        where: { id: parseInt(id as string) },
        data: req.body
      });

      return res.status(200).json({
        message: "Business updated successfully",
        data: updatedBusiness,
        status: 200,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Something went wrong while updating business",
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

      await prisma.business.updateMany({
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
