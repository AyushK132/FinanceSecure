"use client";

import { useState, useMemo } from "react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bar, BarChart } from "recharts";
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'; 
import Animation from "components/ui/animation"
import CountUp from "react-countup"


const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

function TransactionOverviewChart({ transactions}) {

 
  


  const [dateRange, setDateRange] = useState("1M");
  const [chartType, setChartType] = useState("bar"); // State to toggle between Bar and Area chart

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const monthlyData = useMemo(() => {
    // Group transactions by month
    const grouped = transactions.reduce((acc, transaction) => {
      const month = format(new Date(transaction.date), "MMMM yyyy");
      if (!acc[month]) {
        acc[month] = { month, expense: 0 };
      }
      if (transaction.type === "EXPENSE") {
        acc[month].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`)
    );
  }, [transactions]);



  return (
    <div className="">
          
              


      <div className="flex flex-row justify-between gap-3 overflow-x-hidden pb-[25px]">
        <Card className="hover:shadow-md transition-shadow transform hover:translate-y-[-10px] transition-transform relative mt-4 h-[200px] w-[300px] rounded-lg shadow-md text-white bg-gradient-to-r from-[#f6bf9c] to-[#f195ac] overflow-hidden border-none">
          <CardContent className="flex flex-col justify-between h-full p-4 relative">
          <div className="absolute -top-[10px] left-[200px]  w-[155px] h-[155px] bg-white/15 rounded-full"></div>
          <div className="absolute top-[100px] left-[120px] w-[200px] h-[200px] bg-white/15 rounded-full"></div>
            <div>
              <p className="text-lg font-bold opacity-80">Total Income</p>
              <ArrowUpRight className="absolute left-[260px] -top-[0px]   w-[40px] h-[40px] text-white" /> 
              
              <p className="flex items-center h-64 w-64 text-[30px] font-bold text-white ">

              <CountUp end = {totals.income.toFixed(2)}
              
              duration = {3.5}
              prefix = "$"
              decimal = "."
              decimals = {2}
          />

              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow transform hover:translate-y-[-10px] transition-transform relative mt-4 h-[200px] w-[300px] rounded-lg shadow-md text-white bg-gradient-to-r from-[#c0ddfa] to-[#0569e6] overflow-hidden border-none">
          <CardContent className="flex flex-col justify-between h-full p-4 relative">
          <div className="absolute -top-[10px] left-[200px]  w-[155px] h-[155px] bg-white/15 rounded-full"></div>
          <div className="absolute top-[100px] left-[120px] w-[200px] h-[200px] bg-white/15 rounded-full"></div>
            <div>
              <p className="text-lg font-bold opacity-80">Total Expenses</p>
              <ArrowDownRight className="absolute left-[260px] -top-[0px]   w-[40px] h-[40px] text-white" />
              <p className="flex items-center h-64 w-64 text-[30px] font-bold text-white">
              <CountUp end = {totals.expense.toFixed(2)}
              
                  duration = {3.5}
                  prefix = "$"
                  decimal = "."
                  decimals = {2}
              />
                
                
                </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow transform hover:translate-y-[-10px] transition-transform relative mt-4 h-[200px] w-[300px] rounded-lg shadow-md text-white bg-gradient-to-br from-indigo-600 to-purple-400 overflow-hidden border-none">
          <CardContent className="flex flex-col justify-between h-full p-4 relative">
          <div className="absolute -top-[10px] left-[200px]  w-[155px] h-[155px] bg-white/15 rounded-full"></div>
          <div className="absolute top-[100px] left-[120px] w-[200px] h-[200px] bg-white/15 rounded-full"></div>
            <div>
              <p className="text-lg font-bold opacity-80">Net</p>
              <p className={`flex items-center h-64 w-64 text-[30px] font-bold `}>
                

                <CountUp end = {(totals.income - totals.expense).toFixed(2)}
              
              duration = {3.5}
              prefix = "$"
              decimal = "."
              decimals = {2}
          />


              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <CardTitle className="text-base font-normal">Transaction Overview</CardTitle>
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
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
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f6bf9c" />
      <stop offset="100%" stopColor="#f195ac" />
    </linearGradient>
    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#c0ddfa" />
      <stop offset="100%" stopColor="#0569e6" />
    </linearGradient>
  </defs>
                  <CartesianGrid strokeDasharray="3 5" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, undefined]} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="url(#incomeGradient)" radius={[4, 4, 0, 0]} />
  <Bar dataKey="expense" name="Expense" fill="url(#expenseGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
              ) : (
                <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }} >
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f6bf9c" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f195ac" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c0ddfa" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0569e6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MMM dd")} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, undefined]} />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#f195ac" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="expense" name="Expense" stroke="#0569e6" fillOpacity={1} fill="url(#colorExpense)" />
                  <Legend />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      
<div className = "flex flex-row gap-[60px] mt-[20px] ">
      <Card className = "h-[500px] w-2/3 mt-[20px] border-white">
        <CardHeader>
          <CardTitle>Monthly Expense Overview</CardTitle>
          <CardDescription>Showing total expenses by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={monthlyData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
           
              <XAxis
                type="number"
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Expense"]} />
              <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="70%" y2="20%">
      <stop offset="0%" style={{ stopColor: "#c0ddfa", stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: "#0569e6", stopOpacity: 1 }} />
    </linearGradient>
  </defs>

              <Bar dataKey="expense" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
       
      </Card>



      <Card

  className="h-[500px] w-1/3 mt-[20px] border-none !border-0"
>
                <Animation/>
                

      </Card>
      </div>
    </div>
  );
}

export default TransactionOverviewChart;
