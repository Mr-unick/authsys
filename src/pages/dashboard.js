import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/components/ui/card";
import { BarCharMonthly } from "../app/components/charts/barchart";
import { PieChartComponent } from "../app/components/charts/donutchart";
import { TrendingUp } from "lucide-react";
import { chartDataMonth, chartDataYear, userData } from "../../const";
import UserTable from "../app/components/tables/userTable";
import ActivityTab from "./activity";
import BoardLeads from "@/app/components/tables/boardLeads";
import DashboardNewLeads from "@/app/components/tables/dashboardtables/dashboardNewLeads";

const Dashboard = ({data}) => {
 

  return (
    <div className="min-h-screen bg-gray-100 max-sm:bg-white space-y-4 px-2 pb-24 max-sm:pb-36 ">
      {/* Top row metrics */}
      <div className="grid grid-cols-7 gap-4 max-sm:grid-cols-2">
       
       { data?.leadstages &&
        data?.leadstages.map((item)=>{

          return (
            <Card className={`h-12 max-sm:h-10 flex items-center overflow-hidden border-l-4 border-l-[${item.colour}] shadow-sm hover:shadow transition-all duration-200`}>
              <CardHeader className="py-2 px-4">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                  <TrendingUp size={16} className={`mr-1`} />
                 {item?.stage}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4 flex-1 flex justify-end">
                <div className="text-2xl max-sm:text-sm font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                 {item?.count}
                </div>
              </CardContent>
            </Card>
          )
        })
       }
        
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-12 gap-4">
     {
          data?.yearchart && <Card className="col-span-8 max-sm:col-span-12">
            <CardHeader>
              <CardTitle>{data?.yearchart?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarCharMonthly data={data?.yearchart?.data} chartConfig={data?.yearchart?.chartConfig} />
            </CardContent>
          </Card>
     }

        {
          data?.notifications && <Card className="col-span-8 max-sm:col-span-12 rounded-md">
            <CardContent className="overflow-y-scroll flex flex-col p-2  h-[30rem]">
              <ActivityTab/>
            </CardContent>
          </Card>
        }
       

        {/* Pie Charts and Donut */}
        {
          data?.leadsource && <Card className="col-span-4 max-sm:col-span-12">
            <CardHeader>
              <CardTitle>{data?.leadsource?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartComponent radius={80}  data={data?.leadsource?.data}/>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </CardContent>
          </Card>
        }
        {
          data?.newleads && <Card className="col-span-6 max-sm:col-span-12 ">
            <CardHeader className="pt-4">
              <CardTitle>{data?.newleads?.title}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-scroll flex flex-col p-2  h-[30rem] pt-4">
              <DashboardNewLeads />
            </CardContent>
          </Card>
        }
        
       
       {
          data?.salespersons && <Card className="col-span-6 max-sm:col-span-12 ">
            <CardHeader>
              <CardTitle>{data?.salespersons?.title}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-scroll flex flex-col p-2  h-[20rem]">
              <UserTable userData={data?.salespersons?.data} />
            </CardContent>
          </Card>
       }

       

        {/* Bar Chart */}

        {
          data?.performance && <Card className="col-span-6 max-sm:col-span-12">
            <CardHeader>
              <CardTitle>{data?.performance?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <BarCharMonthly data={data?.performance?.data} chartConfig={data?.performance?.chartConfig} />
            </CardContent>
          </Card>
        }

        
      </div>
    </div>
  );
};

export default Dashboard;
