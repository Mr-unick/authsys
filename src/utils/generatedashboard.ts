import prisma from "@/app/lib/prisma";
import { mapLeadSourcesToChartData } from "./utility";
import fs from 'fs';

const monthsLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default async function generateDashboard(user: any) {
    const role = user.role;
    const businessId = user.business;
    const userId = user.id;

    // Detect if Super Admin (Admin with no business)
    const isSuperAdmin = (role === 'Admin' || role === 'Super Admin') && !businessId;

    // Detect if Tenant Admin (Buisness Admin or Admin with business)
    const isTenantAdmin = (role === 'Buisness Admin' || role === 'Admin') && businessId;

    // Default to Sales Person if neither of the above
    const isSalesperson = !isSuperAdmin && !isTenantAdmin;

    try {
        if (isSuperAdmin) {
            return await getSuperAdminData();
        } else if (isTenantAdmin) {
            return await getTenantAdminData(businessId);
        } else {
            return await getSalespersonData(userId, businessId);
        }
    } catch (error) {
        fs.appendFileSync('dashboard_error.txt', `\n[${new Date().toISOString()}] DASHBOARD ERROR: ${error.stack || error.message}\n`);
        console.error("CRITICAL DASHBOARD ERROR:", error);
        throw error;
    }
}

async function getSuperAdminData() {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Stats
    const totalLeads = await prisma.lead.count({ where: { deleted_at: null } });
    const totalUsers = await prisma.user.count({ where: { deleted_at: null } });
    const inactiveUsers = await prisma.user.count({ where: { NOT: { deleted_at: null } } });
    const totalBusinesses = await prisma.business.count({ where: { deleted_at: null } });
    const recentlyAddedTenants = await prisma.business.count({
        where: {
            deleted_at: null,
            created_at: { gte: thirtyDaysAgo }
        }
    });

    // Yearly/Monthly Lead groupings
    const leads = await prisma.lead.findMany({
        where: { deleted_at: null },
        select: { created_at: true }
    });

    const leadTrend = monthsLabels.map((month, idx) => {
        const count = leads.filter(l => l.created_at.getMonth() === idx).length;
        return { name: month, count };
    });

    // Business Growth (last 6 months)
    const businesses = await prisma.business.findMany({
        where: { deleted_at: null },
        select: { created_at: true }
    });

    // Lead Source Platform Wide
    const sources = await prisma.lead.groupBy({
        by: ['lead_source'],
        where: { deleted_at: null },
        _count: { _all: true }
    });

    return {
        role: 'SUPER_ADMIN',
        summary: [
            { label: 'Total Leads', value: totalLeads, trend: '+12%', icon: 'activity' },
            { label: 'Total Users', value: totalUsers, trend: '+5%', icon: 'users' },
            { label: 'Total Tenants', value: totalBusinesses, trend: '+2', icon: 'business' },
            { label: 'Active Status', value: 'Healthy', trend: 'Live', icon: 'zap' }
        ],
        charts: {
            leadAnalytics: {
                title: 'Platform Lead Growth',
                data: leadTrend
            },
            userDistribution: {
                title: 'User Status',
                data: [
                    { label: 'Active', value: totalUsers, color: '#4E49F2' },
                    { label: 'Inactive', value: inactiveUsers, color: '#E2E8F0' }
                ]
            },
            leadSources: {
                title: 'Platform Lead Sources',
                data: mapLeadSourcesToChartData(sources.map(s => ({ source: s.lead_source || 'Unknown', count: s._count._all })))
            }
        },
        tenants: {
            title: 'Recently Added Tenants',
            stats: { total: totalBusinesses, recentlyAdded: recentlyAddedTenants },
            recent: await prisma.business.findMany({
                where: { deleted_at: null },
                orderBy: { created_at: 'desc' },
                take: 5
            })
        }
    };
}

async function getTenantAdminData(businessId: number) {
    const leads = await prisma.lead.findMany({
        where: { business_id: businessId, deleted_at: null },
        include: { stage: true }
    });

    const users = await prisma.user.findMany({
        where: { business_id: businessId, deleted_at: null },
        include: {
            leadUsers: {
                include: { lead: true }
            }
        }
    });

    const stages = await prisma.leadStage.findMany({
        where: { business_id: businessId, deleted_at: null },
        orderBy: { id: 'asc' }
    });

    // Lead Trend
    const leadTrend = monthsLabels.map((month, idx) => {
        const count = leads.filter(l => l.created_at.getMonth() === idx).length;
        return { name: month, count };
    });

    // Stage Distribution (Funnel)
    const stageDistribution = stages.map(s => ({
        label: s.stage_name,
        count: leads.filter(l => l.stage_id === s.id).length,
        color: s.colour || '#4E49F2'
    }));

    // Lead Sources
    const sources = await prisma.lead.groupBy({
        by: ['lead_source'],
        where: { business_id: businessId, deleted_at: null },
        _count: { _all: true }
    });

    // User Leaderboard
    const lastStageId = stages.length > 0 ? stages[stages.length - 1]?.id : null;
    const teamPerformance = users.map(u => {
        const assigned = u.leadUsers.length;
        const conversions = lastStageId ? u.leadUsers.filter(lu => lu.lead.stage_id === lastStageId).length : 0;
        return {
            id: u.id,
            name: u.name,
            email: u.email,
            assigned,
            conversions,
            rate: assigned > 0 ? Math.round((conversions / assigned) * 100) : 0,
            profileImg: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`
        };
    }).sort((a, b) => b.rate - a.rate);

    // Today's Reminders
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const remindersToday = await prisma.lead.findMany({
        where: {
            business_id: businessId,
            deleted_at: null,
            nextFollowUp: {
                gte: startOfToday,
                lte: endOfToday
            }
        },
        include: { stage: true },
        orderBy: { nextFollowUp: 'asc' }
    });

    return {
        role: 'TENANT_ADMIN',
        summary: [
            { label: 'Business Leads', value: leads.length, icon: 'activity' },
            { label: 'Team Members', value: users.length, icon: 'users' },
            { label: 'Conversions', value: teamPerformance.reduce((acc, curr) => acc + curr.conversions, 0), icon: 'zap' },
            { label: 'Avg Conversion', value: `${Math.round(teamPerformance.reduce((acc, curr) => acc + curr.rate, 0) / (teamPerformance.length || 1))}%`, icon: 'trending-up' }
        ],
        remindersToday: remindersToday.map(r => ({
            id: r.id,
            name: r.name,
            time: r.nextFollowUp,
            stage: r.stage?.stage_name
        })),
        charts: {
            leadsByMonth: {
                title: 'Monthly Lead Trend',
                data: leadTrend
            },
            stageDistribution: {
                title: 'Lead Pipeline',
                data: stageDistribution
            },
            leadSources: {
                title: 'Lead Sources',
                data: mapLeadSourcesToChartData(sources.map(s => ({ source: s.lead_source || 'Unknown', count: s._count._all })))
            },
            teamActivity: {
                title: 'Leads Assigned Per User',
                data: teamPerformance.map(u => ({ name: u.name, count: u.assigned }))
            }
        },
        leaderboard: teamPerformance
    };
}

async function getSalespersonData(userId: number, businessId: number) {
    const leadUsers = await prisma.leadUser.findMany({
        where: { user_id: userId, lead: { deleted_at: null } },
        include: { lead: { include: { stage: true } } }
    });

    const leads = leadUsers.map(lu => lu.lead);

    // Today's Reminders for specific salesperson
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const remindersToday = await prisma.lead.findMany({
        where: {
            deleted_at: null,
            nextFollowUp: {
                gte: startOfToday,
                lte: endOfToday
            },
            leadUsers: {
                some: {
                    user_id: userId
                }
            }
        },
        include: { stage: true },
        orderBy: { nextFollowUp: 'asc' }
    });

    // Personal Trend
    const leadTrend = monthsLabels.map((month, idx) => {
        const count = leads.filter(l => l.created_at.getMonth() === idx).length;
        return { name: month, count };
    });

    // Personal Stages
    const stageCounts = new Map();
    leads.forEach(l => {
        if (l.stage) {
            const name = l.stage.stage_name;
            stageCounts.set(name, (stageCounts.get(name) || 0) + 1);
        }
    });

    const stageDistribution = Array.from(stageCounts.entries()).map(([name, count]) => ({
        label: name,
        value: count,
        color: leads.find(l => l.stage?.stage_name === name)?.stage?.colour || '#4E49F2'
    }));

    // Conversions
    const stages = await prisma.leadStage.findMany({
        where: { business_id: businessId, deleted_at: null },
        orderBy: { id: 'asc' }
    });
    const lastStageId = stages.length > 0 ? stages[stages.length - 1]?.id : null;
    const conversions = lastStageId ? leads.filter(l => l.stage_id === lastStageId).length : 0;
    const rate = leads.length > 0 ? Math.round((conversions / leads.length) * 100) : 0;

    return {
        role: 'SALES_PERSON',
        summary: [
            { label: 'My Assigned Leads', value: leads.length, icon: 'users' },
            { label: 'My Conversions', value: conversions, icon: 'zap' },
            { label: 'Conversion Rate', value: `${rate}%`, icon: 'trending-up' },
            { label: 'Recent Rank', value: '#1', icon: 'award' }
        ],
        remindersToday: remindersToday.map(r => ({
            id: r.id,
            name: r.name,
            time: r.nextFollowUp,
            stage: r.stage?.stage_name
        })),
        charts: {
            personalTrend: {
                title: 'My Monthly Performance',
                data: leadTrend
            },
            personalStages: {
                title: 'My Leads by Stage',
                data: stageDistribution
            }
        },
        recentLeads: leads.slice(0, 5).map(l => ({
            id: l.id,
            name: l.name,
            email: l.email,
            stage: l.stage?.stage_name,
            time: l.created_at
        }))
    };
}

