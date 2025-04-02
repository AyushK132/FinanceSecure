"use client";

import { useState, useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const DATE_RANGES = {
  "1M": { label: "Last Month", months: 1 },
  "3M": { label: "Last 3 Months", months: 3 },
  "6M": { label: "Last 6 Months", months: 6 },
  "12M": { label: "Last 12 Months", months: 12 },
};

function TransactionOverviewChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");
  const [chartType, setChartType] = useState("bar");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = subMonths(now, range.months);
    const endDate = now;

    // Filter transactions based on the selected date range
    const filtered = transactions.filter(
      (transaction) => new Date(transaction.date) >= startDate && new Date(transaction.date) <= endDate
    );

    // Group transactions by month and calculate the total expenses for each month
    const grouped = filtered.reduce((acc, transaction) => {
      const month = format(new Date(transaction.date), "MMM yyyy");
      if (!acc[month]) {
        acc[month] = { month, totalExpense: 0 };
      }
      acc[month].totalExpense += transaction.type === "EXPENSE" ? transaction.amount : 0;
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [transactions, dateRange]);

  return (
    <div>
      <div className="flex justify-between gap-3 mb-4">
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue={chartType} onValueChange={setChartType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Chart Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="area">Area Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-normal">Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                <Legend />
                <Bar dataKey="totalExpense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TransactionOverviewChart;
