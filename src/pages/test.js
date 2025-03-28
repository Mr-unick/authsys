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

const Dashboard = () => {
  const yearlyData = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 75 },
    { month: "Mar", value: 85 },
    { month: "Apr", value: 70 },
    { month: "May", value: 90 },
    { month: "Jun", value: 100 },
    { month: "Apr", value: 70 },
    { month: "May", value: 90 },
    { month: "Jun", value: 100 },
    { month: "Apr", value: 70 },
    { month: "May", value: 90 },
    { month: "Jun", value: 100 },
  ];

  const barData = [
    { name: "Q1", value: 40 },
    { name: "Q2", value: 55 },
    { name: "Q3", value: 75 },
    { name: "Q4", value: 65 },
  ];

  const pieData = [
    { name: "Product A", value: 35 },
    { name: "Product B", value: 25 },
    { name: "Product C", value: 40 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div className="min-h-screen bg-gray-100  space-y-4 px-2 pb-24">
      {/* Top row metrics */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="h-16 flex items-center overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <TrendingUp size={16} className="mr-1 text-blue-500" />
              New
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 flex-1 flex justify-end">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              9
            </div>
          </CardContent>
        </Card>
        <Card className="h-16 flex items-center overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <TrendingUp size={16} className="mr-1 text-blue-500" />
              New
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 flex-1 flex justify-end">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              9
            </div>
          </CardContent>
        </Card>
        <Card className="h-16 flex items-center overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <TrendingUp size={16} className="mr-1 text-blue-500" />
              New
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 flex-1 flex justify-end">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              9
            </div>
          </CardContent>
        </Card>
        <Card className="h-16 flex items-center overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <TrendingUp size={16} className="mr-1 text-blue-500" />
              New
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 flex-1 flex justify-end">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              9
            </div>
          </CardContent>
        </Card>
        <Card className="h-16 flex items-center overflow-hidden border-l-4 border-l-blue-500 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="py-2 px-4">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
              <TrendingUp size={16} className="mr-1 text-blue-500" />
              New
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4 flex-1 flex justify-end">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              9
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Line Chart */}
        <Card className="col-span-8">
          <CardHeader>
            <CardTitle>Yearly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <BarCharMonthly data={chartDataYear} />
          </CardContent>
        </Card>

        {/* Pie Charts and Donut */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Lead Source</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChartComponent radius={80} />
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

        <Card className="col-span-6 ">
          <CardHeader>
            <CardTitle>Sales Persons</CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-scroll flex flex-col p-2  h-[20rem]">
            <UserTable userData={userData} />
          </CardContent>
        </Card>

        {/* Bar Chart */}

        <Card className="col-span-6">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <BarCharMonthly data={chartDataMonth} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
