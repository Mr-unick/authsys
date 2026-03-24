import prisma from "@/app/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { name, email, mobile, business_name, selected_features, total_price } = req.body;

        if (!name || !email || !mobile) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const request = await prisma.featurePricingRequest.create({
            data: {
                name,
                email,
                mobile,
                business_name: business_name || "N/A",
                selected_features: selected_features || {},
                total_price: parseInt(total_price) || 0
            }
        });

        return res.status(200).json({ success: true, message: 'Request submitted successfully!', data: request });
    } catch (error: any) {
        console.error("Pricing Request Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
