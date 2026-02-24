"use client"

import React from "react";
import {
    Line,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../../../components/components/ui/chart";

export function LineChartComponent({ data, chartConfig }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs font-bold uppercase tracking-widest">
                Insufficient Data Points
            </div>
        );
    }

    // Support both key-value pairs (isSalesperson trend) and the complex { value, color } structure
    const transformedData = data.map(item => {
        const newItem = { name: item.name || item.column };
        Object.keys(item).forEach(key => {
            if (key !== "name" && key !== "column") {
                newItem[key] = typeof item[key] === 'object' ? item[key].value : item[key];
            }
        });
        return newItem;
    });

    const dataKeys = Object.keys(transformedData[0]).filter(key => key !== "name");

    return (
        <ChartContainer config={chartConfig || {}} className="h-full w-full">
            <LineChart
                data={transformedData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                />
                <ChartTooltip
                    content={<ChartTooltipContent indicator="line" className="bg-white border-gray-100 shadow-xl" />}
                />
                {dataKeys.map((key, index) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={chartConfig?.[key]?.color || (index === 0 ? "#4E49F2" : "#22c55e")}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                ))}
            </LineChart>
        </ChartContainer>
    );
}
