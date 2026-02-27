import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";
import { ResponseInstance } from "@/utils/instances";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, 'business'); // Requires business management permission
    if (res.writableEnded) return;

    // Only Portal Admins (Super Admins) should manage subscriptions
    const rawRole = (typeof user.role === 'string' ? user.role : (user.role?.name || 'USER'));
    const role = rawRole.trim().toUpperCase().replace(/\s+/g, '_');
    const isPortalAdmin = role.includes('SUPER') || (user.permissions || []).includes('*');

    if (!isPortalAdmin) {
        return res.status(403).json({ message: "Forbidden: Super Admin access required", status: 403 });
    }

    if (req.method === "GET") {
        try {
            const { business_id } = req.query;
            if (!business_id) return res.status(400).json({ message: "Business ID is required", status: 400 });

            const business = await prisma.business.findUnique({
                where: { id: Number(business_id) },
                include: { features: true }
            });

            if (!business) return res.status(404).json({ message: "Business not found", status: 404 });

            return res.status(200).json({
                message: "Subscription data fetched",
                data: {
                    status: business.subscription_status,
                    plan: business.subscription_plan,
                    trial_expiry: business.trial_expiry,
                    is_on_trial: business.is_on_trial,
                    features: business.features
                },
                status: 200
            });
        } catch (e: any) {
            return res.status(500).json({ message: e.message, status: 500 });
        }
    }

    if (req.method === "POST" || req.method === "PUT") {
        try {
            const { business_id, plan, status, trial_months, features } = req.body;

            if (!business_id) return res.status(400).json({ message: "Business ID is required", status: 400 });

            let trial_expiry: any = null;
            let is_on_trial = false;

            if (trial_months && Number(trial_months) > 0) {
                const date = new Date();
                date.setMonth(date.getMonth() + Number(trial_months));
                trial_expiry = date;
                is_on_trial = true;
            }

            await prisma.$transaction(async (tx) => {
                // Update Business subscription fields
                await tx.business.update({
                    where: { id: Number(business_id) },
                    data: {
                        subscription_plan: plan,
                        subscription_status: status || 'ACTIVE',
                        trial_expiry: trial_expiry,
                        is_on_trial: is_on_trial
                    }
                });

                // Update Features
                if (features && Array.isArray(features)) {
                    // Delete existing features for this business to sync
                    await tx.businessFeature.deleteMany({
                        where: { business_id: Number(business_id) }
                    });

                    // Create new feature assignments
                    if (features.length > 0) {
                        await tx.businessFeature.createMany({
                            data: features.map((fKey: string) => ({
                                business_id: Number(business_id),
                                feature_key: fKey,
                                is_enabled: true
                            }))
                        });
                    }
                }
            });

            return res.status(200).json({
                message: "Subscription and features updated successfully",
                status: 200
            });
        } catch (e: any) {
            return res.status(500).json({ message: e.message, status: 500 });
        }
    }

    return res.status(405).json({ message: "Method not allowed", status: 405 });
}
