import prisma from "@/app/lib/prisma";
import fs from 'fs';

export default async function handler(req: any, res: any) {
    if (req.method === "GET") {
        try {
            const policies = await prisma.policy.findMany({
                include: {
                    permissions: true
                }
            }).catch(err => {
                fs.appendFileSync('policy_api_error.txt', `[${new Date().toISOString()}] DB ERROR: ${err.message}\n`);
                return [];
            });

            return res.json({
                message: "Policy fetched successfully",
                data: policies,
                status: 200
            });
        } catch (error: any) {
            fs.appendFileSync('policy_api_error.txt', `[${new Date().toISOString()}] HANDLER ERROR: ${error.stack}\n`);
            return res.status(500).json({
                message: "Something went wrong",
                status: 500,
                error: error.message
            });
        }
    }

    if (req.method === "POST") {
        try {
            const { name, description, permissionIds } = req.body;

            const policy = await prisma.policy.create({
                data: {
                    name: name || "dashboard",
                    description: description || "User can view dashboard",
                    permissions: {
                        connect: (permissionIds || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).map((id: number) => ({ id }))
                    }
                },
                include: {
                    permissions: true
                }
            });

            return res.json({
                message: "Policy created successfully",
                data: policy,
                status: 200
            });
        } catch (error: any) {
            return res.status(500).json({
                message: "Something went wrong",
                status: 500,
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed", status: 405 });
}
