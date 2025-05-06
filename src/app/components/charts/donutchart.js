"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
const chartData = [
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(215, 100%, 50%)", // Royal Blue
    },
    edge: {
      label: "Edge",
      color: "hsl(210, 80%, 55%)", // Steel Blue
    },
    other: {
      label: "Other",
      color: "hsl(210, 40%, 60%)", // Light Steel Blue
    },
  };
  

export function PieChartComponent({radius,data}) {

  console.log(data)

  const totalVisitors = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
  
        <ChartContainer
           config={chartConfig}
          className="mx-auto aspect-square "
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={radius}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Leads
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
   
  )
}
