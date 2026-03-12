import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import fs from 'fs';

export default async function handler(req: any, res: any) {
    let user = await VerifyToken(req, res, 'area_of_operation');
    if (res.writableEnded) return;

    if (req.method == "GET") {
        try {
            const areaOfOperationData = await prisma.areaOfOperation.findMany({
                where: {
                    business_id: user.business,
                    deleted_at: null
                }
            });

            const tableData = new GenerateTable({
                name: "Area Of Operation",
                data: areaOfOperationData,
            }).policy(user, 'area_of_operation').addform('areaofoperationform').gettable();

            const response: ResponseInstance = {
                status: 200,
                message: 'Area of Operation fetched successfully',
                data: tableData
            };

            return res.json(response);
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: 'Something Went Wrong',
                data: error.message
            });
        }
    }

    // ---- CREATE ----
    if (req.method === "POST") {
        try {
            const { name, email, number, address } = req.body;
            if (!name) {
                return res.status(400).json({ status: 400, message: "Name is required", data: [] });
            }

            const newArea = await prisma.areaOfOperation.create({
                data: {
                    name,
                    email,
                    number,
                    address,
                    business_id: user.business,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });

            return res.status(201).json({
                status: 201,
                message: "Area of Operation created successfully",
                data: newArea
            });
        } catch (error: any) {
            console.error("[getAreaOfOperationProps POST ERROR]:", error);
            fs.appendFileSync('area_api_error.txt', `[${new Date().toISOString()}] POST ERROR: ${error.stack}\nBody: ${JSON.stringify(req.body)}\nUser: ${JSON.stringify(user)}\n`);
            return res.status(500).json({
                status: 500,
                message: "Something went wrong during creation",
                data: [error.message],
            });
        }
    }

    // ---- UPDATE ----
    if (req.method === "PUT") {
        try {
            const { id } = req.query;
            const { name, email, number, address } = req.body;

            if (!id) {
                return res.status(400).json({ status: 400, message: "Update ID is required", data: [] });
            }

            const updatedArea = await prisma.areaOfOperation.update({
                where: { id: Number(id), business_id: user.business },
                data: {
                    name,
                    email,
                    number,
                    address,
                    updated_at: new Date()
                }
            });

            return res.status(200).json({
                status: 200,
                message: "Area of Operation updated successfully",
                data: updatedArea
            });
        } catch (error: any) {
            console.error("[getAreaOfOperationProps PUT ERROR]:", error);
            fs.appendFileSync('area_api_error.txt', `[${new Date().toISOString()}] PUT ERROR: ${error.stack}\nBody: ${JSON.stringify(req.body)}\nUser: ${JSON.stringify(user)}\n`);
            return res.status(500).json({
                status: 500,
                message: "Something went wrong during update",
                data: [error.message],
            });
        }
    }

    // ---- SOFT DELETE ----
    if (req.method === "DELETE" || req.query.delete) {
        try {
            const rowData = req.body.leads || req.body.data || (req.query.id ? [{ id: Number(req.query.id) }] : []);
            const ids = rowData?.map((item: any) => item.id);
            if (!ids || ids.length === 0) {
                return res.status(400).json({ status: 400, message: "No records specified for deletion", data: [] });
            }

            await prisma.areaOfOperation.updateMany({
                where: { id: { in: ids }, business_id: user.business },
                data: { deleted_at: new Date() }
            });

            return res.status(200).json({
                status: 200,
                message: "Deleted successfully",
                data: [],
            });
        } catch (error: any) {
            console.error("[getAreaOfOperationProps DELETE ERROR]:", error);
            fs.appendFileSync('area_api_error.txt', `[${new Date().toISOString()}] DELETE ERROR: ${error.stack}\n`);
            return res.status(500).json({
                status: 500,
                message: "Deletion failed",
                data: [error.message],
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed", status: 405 });
}
