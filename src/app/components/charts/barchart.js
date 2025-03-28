"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/components/ui/chart"




const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
  assigned: {
    label: "Mobile",
    color: "#60a5fa",
  },
  conversions: {
    label: "Mobile",
    color: "#60a5fa",
  },
} 

const colorMap = {
  desktop: "var(--color-desktop)",
  mobile: "var(--color-mobile)",
  tablet: "var(--color-tablet)",
  assigned: "#60a5fa",
  conversions:  "#2563eb",
};

export function BarCharMonthly({data}) {

  const categories = Object.keys(data[0]).filter(key => key !== "month");

  return (
 
        <ChartContainer  config={chartConfig}>
          <BarChart height={'50%'} accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            {categories.map((category) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colorMap[category] || "#8884d8"} 
              radius={4}
              height={4}
            />
          ))}
          </BarChart>
        </ChartContainer>
    
  )
}
