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








export function BarCharMonthly({data ,chartConfig}) {
console.log(chartConfig);
  if(!chartConfig){
    return <h1>No data found</h1>;
  }
  const transformedData = data.map(item => ({
    column: item.column,
    ...Object.keys(item).reduce((acc, key) => {
      if (key !== "column") {
        acc[key] = item[key].value;
      }
      return acc;
    }, {})
  }));

  const categories = Object.keys(data[0]).filter(key => key !== "column");

  return (<ChartContainer config={chartConfig}>
    <BarChart height={"50%"} accessibilityLayer data={transformedData}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="column"
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
          fill={data[0][category]?.color || "#8884d8"}
          radius={4}
        />
      ))}
    </BarChart>
  </ChartContainer>
  )
}
