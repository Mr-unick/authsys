import prisma from "@/app/lib/prisma";
import { mapLeadSourcesToChartData } from "./utility";
import fs from 'fs';

const monthsLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default async function generateDashboard(user: any) {
    if (!user) {
        throw new Error("Unauthorized: User session missing");
    }

    const rawRole = (typeof user.role === 'string' ? user.role : (user.role?.name || 'USER'));
    const role = rawRole.trim().toUpperCase().replace(/\s+/g, '_');
    const businessId = user.business;
    const userId = user.id;

    // Detect if Super Admin (Admin with no business)
    const isSuperAdmin = (role === 'SUPER_ADMIN' || role === 'ADMIN') && (!businessId || businessId === 0);

    // Detect if Tenant Admin (Business Admin or Admin with business)
    const isTenantAdmin = (role === 'BUSINESS_ADMIN' || role === 'BUISNESS_ADMIN' || role === 'ADMIN' || role === 'TENANT_ADMIN') && businessId;
    const isBranchAdmin = user.is_branch_admin && user.branch;
    const branchId = user.branch;

    try {
        // Check if multi-branch is enabled
        const multiBranchFeature = await prisma.businessFeature.findUnique({
            where: { business_id_feature_key: { business_id: businessId || 0, feature_key: 'multi_branch' } }
        });
        const isMultiBranchActive = multiBranchFeature?.is_enabled || false;

        if (isSuperAdmin) {
            return await getSuperAdminData();
        } else if (isTenantAdmin && !isBranchAdmin) {
            // Business Admin sees everything
            return await getTenantAdminData(businessId, null);
        } else if (isBranchAdmin) {
            // Branch Admin sees their branch only
            return await getTenantAdminData(businessId, branchId);
        } else {
            // Salesperson sees their branch only (if multi-branch active)
            return await getSalespersonData(userId, businessId, isMultiBranchActive ? branchId : null);
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

    try {
        // Stats
        const totalLeads = await (prisma as any).lead?.count({ where: { deleted_at: null } }) || 0;
        const totalUsers = await (prisma as any).user?.count({ where: { deleted_at: null } }) || 0;
        const inactiveUsers = await (prisma as any).user?.count({ where: { NOT: { deleted_at: null } } }) || 0;
        const totalBusinesses = await (prisma as any).business?.count({ where: { deleted_at: null } }) || 0;

        // Safely fetch tickets
        let pendingTickets = 0;
        let ticketStats: any[] = [];
        let ticketPriorityStats: any[] = [];

        if ((prisma as any).supportTicket) {
            pendingTickets = await (prisma as any).supportTicket.count({ where: { status: 'open' } }).catch(() => 0);
            ticketStats = await (prisma as any).supportTicket.groupBy({
                by: ['status'],
                _count: { _all: true }
            }).catch(() => []);

            ticketPriorityStats = await (prisma as any).supportTicket.groupBy({
                by: ['priority'],
                _count: { _all: true }
            }).catch(() => []);
        }

        const recentlyAddedTenants = await (prisma as any).business?.count({
            where: {
                deleted_at: null,
                created_at: { gte: thirtyDaysAgo }
            }
        }) || 0;

        // Yearly/Monthly Lead groupings
        const leads = await (prisma as any).lead?.findMany({
            where: { deleted_at: null },
            select: { created_at: true }
        }) || [];

        const leadTrend = monthsLabels.map((month, idx) => {
            const count = leads.filter((l: any) => l.created_at.getMonth() === idx).length;
            return { name: month, count };
        });

        // Lead Source Platform Wide
        const sources = await (prisma as any).lead?.groupBy({
            by: ['lead_source'],
            where: { deleted_at: null },
            _count: { _all: true }
        }) || [];

        return {
            role: 'SUPER_ADMIN',
            summary: [
                { label: 'Total Leads', value: totalLeads, trend: '+12%', icon: 'activity' },
                { label: 'Total Users', value: totalUsers, trend: '+5%', icon: 'users' },
                { label: 'Total Tenants', value: totalBusinesses, trend: '+2', icon: 'business' },
                { label: 'Pending Tickets', value: pendingTickets, trend: 'Support', icon: 'zap' }
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
                    data: mapLeadSourcesToChartData(sources.map((s: any) => ({ source: s.lead_source || 'Unknown', count: s._count?._all || 0 })))
                },
                ticketStatus: {
                    title: 'Support Requests by Status',
                    data: ticketStats.map(s => ({ label: s.status, value: s._count?._all || 0, color: s.status === 'open' ? '#4E49F2' : s.status === 'resolved' ? '#10B981' : '#F59E0B' }))
                },
                ticketPriority: {
                    title: 'Support Priority',
                    data: ticketPriorityStats.map(s => ({ label: s.priority, value: s._count?._all || 0, color: s.priority === 'urgent' ? '#EF4444' : s.priority === 'high' ? '#F59E0B' : '#6366F1' }))
                }
            },
            tenants: {
                title: 'Recently Added Tenants',
                stats: { total: totalBusinesses, recentlyAdded: recentlyAddedTenants },
                recent: await (prisma as any).business?.findMany({
                    where: { deleted_at: null },
                    orderBy: { created_at: 'desc' },
                    take: 5
                }) || []
            }
        };
    } catch (error: any) {
        fs.appendFileSync('dashboard_error.txt', `\n[${new Date().toISOString()}] getSuperAdminData ERROR: ${error.stack || error.message}\n`);
        throw error;
    }
}

async function getTenantAdminData(businessId: number, branchId: number | null) {
    try {
        // Optimization: Fetch onboarding stats
        const [
            branchCount,
            stageCount,
            userCount,
            leadCount,
            integrationCount,
            business
        ] = await Promise.all([
            prisma.branch.count({ where: { business_id: businessId, deleted_at: null } }),
            prisma.leadStage.count({ where: { business_id: businessId, deleted_at: null } }),
            prisma.user.count({ where: { business_id: businessId, deleted_at: null } }),
            prisma.lead.count({ where: { business_id: businessId, deleted_at: null } }),
            prisma.integration.count({ where: { business_id: businessId } }),
            prisma.business.findUnique({ where: { id: businessId } })
        ]);

        const onboardingStats = {
            branchCount,
            stageCount,
            userCount,
            leadCount,
            integrationCount,
            hasBusinessProfile: !!(business?.business_name && business?.email)
        };

        const queryFilter: any = { business_id: businessId, deleted_at: null };
        if (branchId) queryFilter.branch_id = branchId;

        const leads = await (prisma as any).lead?.findMany({
            where: queryFilter,
            include: { stage: true }
        }) || [];

        const usersFilter: any = { business_id: businessId, deleted_at: null };
        if (branchId) usersFilter.branch_id = branchId;

        const users = await (prisma as any).user?.findMany({
            where: usersFilter,
            include: {
                leadUsers: {
                    include: { lead: true }
                }
            }
        }) || [];

        const stagesFilter: any = { business_id: businessId, deleted_at: null };
        if (branchId) stagesFilter.branch_id = branchId;

        const stages = await (prisma as any).leadStage?.findMany({
            where: stagesFilter,
            orderBy: { id: 'asc' }
        }) || [];

        // Lead Trend
        const leadTrend = monthsLabels.map((month, idx) => {
            const count = leads.filter((l: any) => l.created_at.getMonth() === idx).length;
            return { name: month, count };
        });

        // Stage Distribution (Funnel)
        const stageDistribution = stages.map((s: any) => ({
            label: s.stage_name,
            count: leads.filter((l: any) => l.stage_id === s.id).length,
            color: s.colour || '#4E49F2'
        }));

        // Lead Sources
        const sources = await (prisma as any).lead?.groupBy({
            by: ['lead_source'],
            where: queryFilter,
            _count: { _all: true }
        }) || [];

        // User Leaderboard
        const lastStageId = stages.length > 0 ? stages[stages.length - 1]?.id : null;
        const teamPerformance = users.map((u: any) => {
            const assigned = u.leadUsers.length;
            const conversions = lastStageId ? u.leadUsers.filter((lu: any) => lu.lead.stage_id === lastStageId).length : 0;
            return {
                id: u.id,
                name: u.name,
                email: u.email,
                assigned,
                conversions,
                rate: assigned > 0 ? Math.round((conversions / assigned) * 100) : 0,
                profileImg: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`
            };
        }).sort((a: any, b: any) => b.rate - a.rate);

        // Today's Reminders
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const remindersToday = await (prisma as any).lead?.findMany({
            where: {
                ...queryFilter,
                nextFollowUp: {
                    gte: startOfToday,
                    lte: endOfToday
                }
            },
            include: { stage: true },
            orderBy: { nextFollowUp: 'asc' }
        }) || [];

        // User Distribution by Role (Only for Business Admin)
        let userDistribution: any[] = [];
        if (!branchId) {
            const roles = await prisma.role.findMany({
                where: { business_id: businessId, deleted_at: null }
            });
            userDistribution = roles.map(r => ({
                label: r.name,
                value: users.filter((u: any) => u.role_id === r.id).length,
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}` // Random color or predefined map
            }));
            // Add branch admins to distribution
            userDistribution.push({
                label: 'Branch Admins',
                value: users.filter((u: any) => u.is_branch_admin).length,
                color: '#4E49F2'
            });
        }

        // Recently Added Branches (Only for Business Admin)
        let recentBranches: any[] = [];
        if (!branchId) {
            recentBranches = await (prisma.branch as any).findMany({
                where: { business_id: businessId, deleted_at: null },
                orderBy: { id: 'desc' },
                take: 5
            }) || [];
        }

        // Fetch enabled features for this business
        const enabledFeatures = await prisma.businessFeature.findMany({
            where: { business_id: businessId, is_enabled: true },
            select: { feature_key: true }
        });
        const featureKeys = enabledFeatures.map(f => f.feature_key);

        if (!branchId) {
            // Business Admin (Super-Admin style dashboard)
            return {
                role: 'BUSINESS_ADMIN',
                featureKeys,
                onboardingStats,
                summary: [
                    { label: 'Total Business Leads', value: leads.length, icon: 'activity' },
                    { label: 'Total Team Members', value: users.length, icon: 'users' },
                    { label: 'Total Active Branches', value: await prisma.branch.count({ where: { business_id: businessId, deleted_at: null } }), icon: 'business' },
                    { label: 'Total Conversions', value: teamPerformance.reduce((acc: any, curr: any) => acc + curr.conversions, 0), icon: 'zap' }
                ],
                charts: {
                    leadGrowth: {
                        title: 'Enterprise Lead Growth',
                        data: leadTrend
                    },
                    userDistribution: {
                        title: 'Team Composition',
                        data: userDistribution.filter(d => d.value > 0)
                    },
                    leadSources: {
                        title: 'Enterprise Lead Sources',
                        data: mapLeadSourcesToChartData(sources.map((s: any) => ({ source: s.lead_source || 'Unknown', count: s._count?._all || 0 })))
                    },
                    pipeline: {
                        title: 'Enterprise Pipeline',
                        data: stageDistribution
                    }
                },
                branches: {
                    title: 'Recently Added Branches',
                    recent: recentBranches
                },
                leaderboard: teamPerformance.slice(0, 5)
            };
        }

        // Branch Admin (Standard Team Dashboard)
        return {
            role: 'BRANCH_ADMIN',
            featureKeys,
            onboardingStats,
            summary: [
                { label: 'Branch Leads', value: leads.length, icon: 'activity' },
                { label: 'Branch Team', value: users.length, icon: 'users' },
                { label: 'Conversions', value: teamPerformance.reduce((acc: any, curr: any) => acc + curr.conversions, 0), icon: 'zap' },
                { label: 'Avg Conversion', value: `${Math.round(teamPerformance.reduce((acc: any, curr: any) => acc + curr.rate, 0) / (teamPerformance.length || 1))}%`, icon: 'trending-up' }
            ],
            remindersToday: remindersToday.map((r: any) => ({
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
                    data: mapLeadSourcesToChartData(sources.map((s: any) => ({ source: s.lead_source || 'Unknown', count: s._count?._all || 0 })))
                },
                teamActivity: {
                    title: 'Leads Assigned Per User',
                    data: teamPerformance.map((u: any) => ({ name: u.name, count: u.assigned }))
                }
            },
            leaderboard: teamPerformance
        };
    } catch (err: any) {
        fs.appendFileSync('dashboard_error.txt', `\n[${new Date().toISOString()}] getTenantAdminData ERROR: ${err.stack || err.message}\n`);
        throw err;
    }
}

async function getSalespersonData(userId: number, businessId: number, branchId: number | null) {
    try {
        const leadUsers = await (prisma as any).leadUser?.findMany({
            where: {
                user_id: userId,
                lead: {
                    deleted_at: null,
                    ...(branchId ? { branch_id: branchId } : {})
                }
            },
            include: { lead: { include: { stage: true } } }
        }) || [];

        const leads = leadUsers.map((lu: any) => lu.lead);

        // Today's Reminders for specific salesperson
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const remindersToday = await (prisma as any).lead?.findMany({
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
        }) || [];

        // Personal Trend
        const leadTrend = monthsLabels.map((month, idx) => {
            const count = leads.filter((l: any) => l.created_at.getMonth() === idx).length;
            return { name: month, count };
        });

        // Personal Stages
        const stageCounts = new Map();
        leads.forEach((l: any) => {
            if (l.stage) {
                const name = l.stage.stage_name;
                stageCounts.set(name, (stageCounts.get(name) || 0) + 1);
            }
        });

        const stageDistribution = Array.from(stageCounts.entries()).map(([name, count]) => ({
            label: name,
            value: count,
            color: leads.find((l: any) => l.stage?.stage_name === name)?.stage?.colour || '#4E49F2'
        }));

        // Conversions
        const stages = await (prisma as any).leadStage?.findMany({
            where: { business_id: businessId, deleted_at: null },
            orderBy: { id: 'asc' }
        }) || [];
        const lastStageId = stages.length > 0 ? stages[stages.length - 1]?.id : null;
        const conversions = lastStageId ? leads.filter((l: any) => l.stage_id === lastStageId).length : 0;
        const rate = leads.length > 0 ? Math.round((conversions / leads.length) * 100) : 0;

        // Fetch enabled features for this business
        const enabledFeatures = await prisma.businessFeature.findMany({
            where: { business_id: businessId, is_enabled: true },
            select: { feature_key: true }
        });
        const featureKeys = enabledFeatures.map(f => f.feature_key);

        return {
            role: 'SALES_PERSON',
            featureKeys,
            summary: [
                { label: 'My Assigned Leads', value: leads.length, icon: 'users' },
                { label: 'My Conversions', value: conversions, icon: 'zap' },
                { label: 'Conversion Rate', value: `${rate}%`, icon: 'trending-up' },
                { label: 'Recent Rank', value: '#1', icon: 'award' }
            ],
            remindersToday: remindersToday.map((r: any) => ({
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
            recentLeads: leads.slice(0, 5).map((l: any) => ({
                id: l.id,
                name: l.name,
                email: l.email,
                stage: l.stage?.stage_name,
                time: l.created_at
            }))
        };
    } catch (err: any) {
        fs.appendFileSync('dashboard_error.txt', `\n[${new Date().toISOString()}] getSalespersonData ERROR: ${err.stack || err.message}\n`);
        throw err;
    }
}

