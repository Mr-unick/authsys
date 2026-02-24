import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function getUserPerformance(req, res) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    const { id } = req.query;
    const targetUserId = parseInt(id as string);

    try {
        // Authorization: Admin can see any user in their business, or Super Admin can see anyone
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: { id: true, name: true, email: true, business_id: true }
        });

        if (!targetUser) return res.status(404).json({ message: "User not found" });

        const isSuperAdmin = (user.role === 'Admin' || user.role === 'Super Admin') && !user.business;
        const isTenantAdmin = (user.role === 'Buisness Admin' || user.role === 'Admin') && user.business === targetUser.business_id;
        const isSelf = user.id === targetUserId;

        if (!isSuperAdmin && !isTenantAdmin && !isSelf) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // Fetch Performance Data
        const leadUsers = await prisma.leadUser.findMany({
            where: { user_id: targetUserId, lead: { deleted_at: null } },
            include: { lead: { include: { stage: true } } }
        });

        const leads = leadUsers.map(lu => lu.lead);
        const stages = await prisma.leadStage.findMany({
            where: { business_id: targetUser.business_id || undefined, deleted_at: null },
            orderBy: { id: 'asc' }
        });

        const lastStageId = stages[stages.length - 1]?.id;
        const conversions = leads.filter(l => l.stage_id === lastStageId).length;
        const rate = leads.length > 0 ? Math.round((conversions / leads.length) * 100) : 0;

        const monthsLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const leadTrend = monthsLabels.map((month, idx) => {
            const count = leads.filter(l => l.created_at.getMonth() === idx).length;
            return { name: month, count };
        });

        const stageCounts = new Map();
        leads.forEach(l => {
            if (l.stage) {
                stageCounts.set(l.stage.stage_name, (stageCounts.get(l.stage.stage_name) || 0) + 1);
            }
        });

        const stageDistribution = Array.from(stageCounts.entries()).map(([name, count]) => ({
            label: name,
            value: count,
            color: stages.find(s => s.stage_name === name)?.colour || '#4E49F2'
        }));

        // Fetch private activities for this user
        const activities = await prisma.activity.findMany({
            where: { user_id: targetUserId, deleted_at: null },
            orderBy: { timestamp: 'desc' },
            take: 10,
            include: { lead: true }
        });

        return res.status(200).json({
            status: 200,
            data: {
                user: {
                    id: targetUser.id,
                    name: targetUser.name,
                    email: targetUser.email,
                    profileImg: `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.name}`
                },
                stats: [
                    { label: 'Assigned', value: leads.length, icon: 'users', color: 'indigo' },
                    { label: 'Converted', value: conversions, icon: 'zap', color: 'green' },
                    { label: 'Success Rate', value: `${rate}%`, icon: 'award', color: 'amber' },
                    { label: 'Avg Time', value: '4.2d', icon: 'activity', color: 'blue' }
                ],
                charts: {
                    trend: leadTrend,
                    stages: stageDistribution
                },
                activities
            }
        });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
