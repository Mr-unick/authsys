import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import bcrypt from "bcryptjs";
import fs from 'fs';

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, 'branches');
    if (res.writableEnded) return;

    if (req.method === "GET") {
        try {
            let branchData;
            if (user?.business) {
                const count = await prisma.branch.count({ where: { business_id: user.business, deleted_at: null } });
                console.log(`[BRANCH_API] User Role: ${user.role}, Active Branches: ${count}`);
                branchData = await prisma.branch.findMany({
                    where: {
                        business_id: user.business,
                        deleted_at: null
                    }
                });
            } else {
                branchData = await prisma.branch.findMany({
                    where: {
                        deleted_at: null
                    }
                });
            }

            const tableData = new GenerateTable({
                name: "Branches",
                data: branchData,
            }).policy(user, 'branches').addform('branchform').gettable();

            const logLine = `[${new Date().toISOString()}] BRANCHES_GET: User: ${user.email}, Role: ${user.role}, Create: ${tableData.create}, Update: ${tableData.update}\n`;
            try { 
                const fs = require('fs');
                const path = require('path');
                fs.appendFileSync(path.join(process.cwd(), 'api_debug.log'), logLine); 
            } catch (e) {}

            return res.status(200).json({
                status: 200,
                message: "Branches fetched successfully",
                data: tableData,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: "Something went wrong",
                data: [error.message],
            });
        }
    }

    if (req.method === "POST") {
        try {
            const {
                name, email, branch_code, number, address, state, district, city, pincode, discription,
                buisness: buisnessId,
                admin_name, admin_email, admin_password
            } = req.body;

            if (!name) {
                return res.status(400).json({ status: 400, message: "Branch name is required", data: [] });
            }
            if (!admin_email || !admin_password) {
                return res.status(400).json({ status: 400, message: "Branch Manager email and password are required", data: [] });
            }

            const targetBusinessId = Number(buisnessId || user.business);

            if (!targetBusinessId || isNaN(targetBusinessId)) {
                return res.status(400).json({
                    status: 400,
                    message: "A valid Business ID is required to create a branch.",
                    data: []
                });
            }

            // 1. Email check for manager
            const existingUser = await prisma.user.findUnique({ where: { email: admin_email } });
            if (existingUser) {
                return res.status(400).json({ status: 400, message: "A user with this email already exists on the platform.", data: [] });
            }

            // 2. Enforcement: Check max_branches limit
            const business = await prisma.business.findUnique({
                where: { id: targetBusinessId }
            });

            const activeBranchCount = await prisma.branch.count({
                where: { business_id: targetBusinessId, deleted_at: null }
            });

            if (business && business.max_branches > 0 && activeBranchCount >= business.max_branches) {
                return res.status(403).json({
                    status: 403,
                    message: `Branch limit reached. Your subscription allows up to ${business.max_branches} branches.`,
                    data: [],
                });
            }

            const result = await prisma.$transaction(async (tx) => {
                // 3. Create the Branch
                const branch = await tx.branch.create({
                    data: {
                        name,
                        email,
                        branch_code,
                        number,
                        address,
                        state,
                        district,
                        city,
                        pincode,
                        discription,
                        location: city || state || 'Main',
                        business_id: targetBusinessId,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                });

                // 4. Create Branch Manager User
                const hashedPassword = await bcrypt.hash(admin_password, 10);
                const managerRole = await tx.role.findFirst({
                    where: { name: { contains: 'Branch Admin' } }
                });

                await tx.user.create({
                    data: {
                        name: admin_name,
                        email: admin_email,
                        password: hashedPassword,
                        business_id: targetBusinessId,
                        branch_id: branch.id,
                        is_branch_admin: true,
                        role_id: managerRole?.id || null,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                });

                return branch;
            });

            return res.status(201).json({
                status: 201,
                message: "Branch and Manager created successfully",
                data: result,
            });

        } catch (error: any) {
            console.error("[getBranchProps POST ERROR]:", error);
            fs.appendFileSync('branch_api_error.txt', `[${new Date().toISOString()}] POST ERROR: ${error.stack}\nBody: ${JSON.stringify(req.body)}\nUser: ${JSON.stringify(user)}\n`);
            return res.status(500).json({
                status: 500,
                message: "Something went wrong during branch creation",
                data: [error.message],
            });
        }
    }

    if (req.method === "PUT") {
        try {
            const id = Number(req.query.id);
            if (!id || isNaN(id)) {
                return res.status(400).json({ status: 400, message: "Branch ID is required", data: [] });
            }

            const {
                name, email, branch_code, number, address, state, district, city, pincode, discription
            } = req.body;

            // Optional: Role checks (User MUST belong to business)
            const targetBusinessId = Number(user.business);
            const whereClause: any = { id };
            
            // Non-SuperAdmins can only mutate branches inside their own business
            if (user.role !== 'SUPER_ADMIN') {
                whereClause.business_id = targetBusinessId;
            }

            const branch = await prisma.branch.findFirst({
                where: whereClause
            });

            if (!branch) {
                return res.status(404).json({ status: 404, message: "Branch not found or unauthorized", data: [] });
            }

            const updatedBranch = await prisma.branch.update({
                where: { id },
                data: {
                    name, 
                    email, 
                    branch_code, 
                    number, 
                    address, 
                    state, 
                    district, 
                    city, 
                    pincode, 
                    discription,
                    location: city || state || 'Main',
                    updated_at: new Date()
                }
            });

            return res.status(200).json({
                status: 200,
                message: "Branch updated successfully",
                data: updatedBranch,
            });
        } catch (error: any) {
            console.error("[getBranchProps PUT ERROR]:", error);
            return res.status(500).json({
                status: 500,
                message: "Failed to update branch",
                data: [error.message],
            });
        }
    }


    // ---- SOFT DELETE ----
    if (req.method === "DELETE" || req.query.delete) {
        try {
            const rowData = req.body.leads || req.body.data;
            const ids = rowData?.map((item: any) => item.id);
            if (!ids || ids.length === 0) {
                return res.status(400).json({ status: 400, message: "No records specified for deletion", data: [] });
            }

            await prisma.branch.updateMany({
                where: { id: { in: ids } },
                data: { deleted_at: new Date() }
            });

            return res.status(200).json({
                status: 200,
                message: "Records deleted successfully",
                data: [],
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: "Deletion failed",
                data: [error.message],
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed", data: [], status: 405 });
}
