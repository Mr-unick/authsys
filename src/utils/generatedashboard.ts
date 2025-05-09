import { Leads } from "@/app/entity";
import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";
import { mapLeadSourcesToChartData } from "./utility";





export default async function generateDashboard(user:any){

    const leadRepository = AppDataSource.getRepository(Leads);
    let dashboardProps : any;

    const salesPersons = await AppDataSource.getRepository(Users)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.leads', 'leads')
        .where('user.buisnesId = :id', { id: user.business })
        .getMany();
    

    let  leads = await leadRepository
    .createQueryBuilder('lead')
    .leftJoin('lead.business', 'business')
    .where('business.id = :businessid', { businessid: user.business })
    .select("DATE_FORMAT(lead.created_at, '%M')", 'month') 
    .addSelect('lead.lead_source', 'source')
    .addSelect('COUNT(*)', 'count');

    
    // 1. Group by Month
const yearLeads = await leadRepository
.createQueryBuilder('lead')
.leftJoin('lead.business', 'business')
.where('business.id = :businessid', { businessid: user.business })
.select("DATE_FORMAT(lead.created_at, '%M')", 'month')
.addSelect('COUNT(*)', 'count')
.groupBy('month')
.getRawMany();

// 2. Group by Source
const leadSource = await leadRepository
.createQueryBuilder('lead')
.leftJoin('lead.business', 'business')
.where('business.id = :businessid', { businessid: user.business })
.select('lead.lead_source', 'source')
.addSelect('COUNT(*)', 'count')
.groupBy('source')
.getRawMany();

// 2. Group by stage
const leadStages = await leadRepository
  .createQueryBuilder('lead')
  .leftJoin('lead.business', 'business')
  .leftJoin('lead.stage', 'stage')
  .where('business.id = :businessid', { businessid: user.business })
  .select('stage.stage_name', 'stage')
  .addSelect('stage.colour','colour') 
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
        conversions : resultMap.get(month)  ? 8 : 0
      }));



 let yearlyleads = finalResult.map((data)=>{
    return {
        column: data?.month, 
        assigned: {
            value:  Number(data.count),
            color: "#2563eb"
        }, 
        conversions: {
            value: data.conversions,
            color: "#8884d8"
        }
    }
  });

    const salesPersonsData = salesPersons.map(data => {
        return {
            id : data?.id,
            username: data?.name,
            assignedLeads: data?.leads?.length,
            conversionPercentage: data?.leads?.length,
            profileImg: 'https://images.pexels.com/photos/864994/pexels-photo-864994.jpeg', contact: 'john@example.com'
        }
    })


    if(user?.role=='Admin'){
        dashboardProps = {
            yearchart : {
                title : 'Yearly Trend',
                data: yearlyleads
            },
            // leadsource : leadSource,
            performance : {
                title : 'Performance',
                data: [
                    { month: "Sam", assigned: 186, conversions: 80 },
                    { month: "John", assigned: 86, conversions: 20 },
                    { month: "jane", assigned: 16, conversions: 8 },
                    { month: "Nick", assigned: 126, conversions: 100 },
                    { month: "Peter", assigned: 86, conversions: 30 },
                ]
            }, salespersons: salesPersonsData
        }
    } else if (user?.role =='Buisness Admin'){

        dashboardProps = {
            leadstages : leadStages,
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
                

                data:yearlyleads
            },
            leadsource: {
                title: 'Lead Source',
                data: mapLeadSourcesToChartData(leadSource)
            },
            performance: {
                title: 'Performance',
                chartConfig :{
                    assigned: {
                        label: "assigned",
                        color: "#60a5fa",
                    },
                    conversions: {
                        label: "conversions",
                        color: "#60a5fa",
                    },
                } ,
                data: [
                    {
                        column: "Nikhil",
                        assigned: {
                            value: 20,
                            color: "#2563eb"
                        },
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    },
                    {
                        column: "Suv",
                        assigned: {
                            value: 10,
                            color: "#2563eb"
                        },
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    }
                ]
            }, salespersons: {
                title : 'Sales Persons',
                data: salesPersonsData
            }
        } 
    } else {
        dashboardProps = {
           
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
                data: [
                    {
                        column: "Nikhil",
                        assigned: {
                            value: 20,
                            color: "#2563eb"
                        },
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    },
                    {
                        column: "Suv",
                        assigned: {
                            value: 10,
                            color: "#2563eb"
                        },
                        conversions: {
                            value: 8,
                            color: "#8884d8"
                        }
                    }
                ]
            },
            notifications: {
                title : 'Notifications',
                data : [
                    { id: 1, title: 'New Lead', message: 'New lead assigned to you', time: '10 minutes ago' }
                ]
            },
            newleads : {    
                title : 'New Leads',
                data : [
                    { id: 1, title: 'New Lead', message: 'New lead assigned to you', time: '10 minutes ago' }
                ]
            }
        }
    }


    return dashboardProps;
}
