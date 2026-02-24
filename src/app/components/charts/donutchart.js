"use client"

import * as React from "react"
import { Label, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/components/ui/chart"

export function PieChartComponent({ radius = 70, data = [] }) {
  const totalValue = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr.value || 0), 0)
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center p-10 text-gray-400 text-xs font-bold uppercase tracking-widest">
        No Data Available
      </div>
    );
  }

  return (
    <ChartContainer
      config={{}}
      className="mx-auto aspect-square w-full max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="bg-white border-gray-100 shadow-xl rounded-xl" />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={radius - 5}
          outerRadius={radius + 35}
          paddingAngle={6}
          strokeWidth={0}
        >
          {data.map((entry, idx) => (
            <Cell
              key={`cell-${idx}`}
              fill={entry.color || entry.fill || '#8884d8'}
              className="hover:opacity-80 transition-opacity cursor-pointer shadow-sm"
            />
          ))}
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
                      className="fill-[#0F1626] text-2xl font-black uppercase tracking-tighter"
                    >
                      {totalValue.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                      className="fill-gray-400 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Total
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
