import { Leads } from "@/app/entity/Leads";
import { Users } from "@/app/entity/Users";
import { Notification } from "@/app/entity/Notifications";
import { AppDataSource } from "@/app/lib/data-source";
import { mapLeadSourcesToChartData } from "./utility";
import { LeadStages } from "@/app/entity/LeadStages";





export default async function generateDashboard(user: any) {
    const leadRepository = AppDataSource.getRepository(Leads);
    const userRepository = AppDataSource.getRepository(Users);
    const notificationRepository = AppDataSource.getRepository(Notification);
    let dashboardProps: any;

    // Fetch all salespersons for the business
    const salesPersons = await userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.leads', 'leads')
        .where('user.buisnesId = :id', { id: user.business })
        .getMany();

    // Fetch all leads for the business
    const allLeads = await leadRepository
        .createQueryBuilder('lead')
        .leftJoinAndSelect('lead.stage', 'stage')
        .leftJoin('lead.business', 'business')
        .where('business.id = :businessid', { businessid: user.business })
        .getMany();

    // Group by Month
    const yearLeads = await leadRepository
        .createQueryBuilder('lead')
        .leftJoin('lead.business', 'business')
        .where('business.id = :businessid', { businessid: user.business })
        .select("DATE_FORMAT(lead.created_at, '%M')", 'month')
        .addSelect('COUNT(*)', 'count')
        .groupBy('month')
        .getRawMany();

    // Group by Source
    const leadSource = await leadRepository
        .createQueryBuilder('lead')
        .leftJoin('lead.business', 'business')
        .where('business.id = :businessid', { businessid: user.business })
        .select('lead.lead_source', 'source')
        .addSelect('COUNT(*)', 'count')
        .groupBy('source')
        .getRawMany();

    // Group by Stage
    const leadStages = await leadRepository
        .createQueryBuilder('lead')
        .leftJoin('lead.business', 'business')
        .leftJoin('lead.stage', 'stage')
        .where('business.id = :businessid', { businessid: user.business })
        .select('stage.stage_name', 'stage')
        .addSelect('stage.colour', 'colour')
        .addSelect('COUNT(*)', 'count')
        .groupBy('stage.stage_name')
        .addGroupBy('stage.colour')
        .getRawMany();

    const allMonths = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const resultMap = new Map(yearLeads.map(r => [r.month, parseInt(r.count)]));
    const finalResult = allMonths.map(month => ({
        month,
        count: resultMap.get(month) || 0,
        conversions: 0 // Will be filled below
    }));

    // Fetch all stages to determine the last (most recently added) stage
    const stageRepository = AppDataSource.getRepository(LeadStages);
    const allStages = await stageRepository
        .createQueryBuilder('stage')
        .leftJoin('stage.business', 'business')
        .where('business.id = :businessId', { businessId: user.business })
        .getMany();
    const lastStage = allStages.reduce((max, stage) => (stage.id > max.id ? stage : max), allStages[0]);
    const lastStageId = lastStage?.id;

    // Calculate conversions per month (leads in last stage)
    const closedWonLeads = allLeads.filter(lead => lead.stage && (lead.stage as any).id === lastStageId);
    const conversionsByMonth: { [month: string]: number } = {};
    closedWonLeads.forEach(lead => {
        const month = lead.created_at.toLocaleString('default', { month: 'long' });
        conversionsByMonth[month] = (conversionsByMonth[month] || 0) + 1;
    });
    finalResult.forEach(item => {
        item.conversions = conversionsByMonth[item.month] || 0;
    });

    let yearlyleads = finalResult.map((data) => {
        return {
            column: data?.month,
            assigned: {
                value: Number(data.count),
                color: "#2563eb"
            },
            conversions: {
                value: data.conversions,
                color: "#8884d8"
            }
        }
    });

    // Salespersons performance data
    const salesPersonsData = salesPersons.map(data => {
        const assignedLeads = data?.leads?.length || 0;
        const conversions = (data?.leads || []).filter(
            (lead: any) => lead.stage && (lead.stage as any).id === lastStageId
        ).length;
        return {
            id: data?.id,
            username: data?.name,
            assignedLeads,
            conversionPercentage: assignedLeads ? Math.round((conversions / assignedLeads) * 100) : 0,
            conversions,
            profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg',
            contact: data?.email || ''
        }
    });

    if (user?.role === 'Admin') {
        dashboardProps = {
            yearchart: {
                title: 'Yearly Trend',
                data: yearlyleads
            },
            performance: {
                title: 'Performance',
                data: salesPersonsData.map(sp => ({
                    month: sp.username,
                    assigned: sp.assignedLeads,
                    conversions: sp.conversions
                }))
            },
            salespersons: salesPersonsData
        }
    } else if (user?.role === 'Buisness Admin') {
        dashboardProps = {
            leadstages: leadStages,
            yearchart: {
                title: 'Yearly Trend',
                chartConfig: {
                    assigned: {
                        label: "assigned",
                        color: "#60a5fa",
                    },
                    conversions: {
                        label: "conversions",
                        color: "#60a5fa",
                    },
                },
                data: yearlyleads
            },
            leadsource: {
                title: 'Lead Source',
                data: mapLeadSourcesToChartData(leadSource)
            },
            performance: {
                title: 'Performance',
                chartConfig: {
                    assigned: {
                        label: "assigned",
                        color: "#60a5fa",
                    },
                    conversions: {
                        label: "conversions",
                        color: "#60a5fa",
                    },
                },
                data: salesPersonsData.map(sp => ({
                    column: sp.username,
                    assigned: {
                        value: sp.assignedLeads,
                        color: "#2563eb"
                    },
                    conversions: {
                        value: sp.conversions,
                        color: "#8884d8"
                    }
                }))
            },
            salespersons: {
                title: 'Sales Persons',
                data: salesPersonsData
            }
        }
    } else {
        // Regular user: fetch their own leads and notifications
        const userWithLeads = await userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.leads', 'leads')
            .leftJoinAndSelect('leads.stage', 'stage')
            .leftJoinAndSelect('leads.users', 'users')
            .where('user.id = :id', { id: user.id })
            .getOne();
        const assignedLeads = userWithLeads?.leads?.length || 0;
        const conversions = (userWithLeads?.leads || []).filter(
            (lead: any) => lead.stage && (lead.stage as any).id === lastStageId
        ).length;
        // Fetch notifications
        const notifications = await notificationRepository.find({
            where: { user: { id: user.id } },
            order: { created_at: 'DESC' },
            take: 10
        });
        dashboardProps = {
            // performance: {
            //     title: 'Performance',
            //     chartConfig: {
            //         assigned: {
            //             label: "assigned",
            //             color: "#60a5fa",
            //         },
            //         conversions: {
            //             label: "conversions",
            //             color: "#60a5fa",
            //         },
            //     },
            //     data: [
            //         {
            //             column: user.name,
            //             assigned: {
            //                 value: assignedLeads,
            //                 color: "#2563eb"
            //             },
            //             conversions: {
            //                 value: conversions,
            //                 color: "#8884d8"
            //             }
            //         }
            //     ]
            // },
            performancePieChart: {
                title: 'Performance',
                data: [
                    {
                        label: 'Assigned',
                        value: assignedLeads,
                        color: '#2563eb' // blue
                    },
                    {
                        label: 'Converted',
                        value: conversions,
                        color: '#22c55e' // green
                    }
                ]
            },
            notifications: {
                title: 'Notifications',
                data: notifications.map(n => ({
                    id: n.id,
                    message: n.message,
                    status: n.status,
                    time: n.created_at
                }))
            },
            newleads: {
                title: 'New Leads',
                data: (userWithLeads?.leads || []).slice(-5).map(lead => ({
                    id: lead.id,
                    title: lead.name,
                    message: `Lead assigned to you: ${lead.name}`,
                    time: lead.created_at
                }))
            },
            pieChartStages: {
                title: 'Assigned Leads by Stage',
                data: (() => {
                    const stageMap = new Map();
                    // Only include leads where the user is assigned (i.e., user.id is in lead.users)
                    (userWithLeads?.leads || []).forEach(lead => {
                        if (lead.stage && Array.isArray(lead.users) && lead.users.some(u => u.id === user.id)) {
                            const stageName = (lead.stage as any).stage_name;
                            const color = (lead.stage as any).colour || '#8884d8';
                            if (!stageMap.has(stageName)) {
                                stageMap.set(stageName, { label: stageName, value: 0, color });
                            }
                            stageMap.get(stageName).value++;
                        }
                    });
                    return Array.from(stageMap.values());
                })()
            }
        }
    }
    return dashboardProps;
}
