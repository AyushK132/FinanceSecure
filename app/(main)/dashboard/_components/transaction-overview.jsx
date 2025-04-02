"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];

export function DashboardOverview({ accounts = [], transactions = [], accountId }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Default selected account ID
  const [selectedAccountId, setSelectedAccountId] = useState(() => {
    return (
      accounts.find((account) => account.isDefault)?.id ||
      accounts[0]?.id ||
      null
    );
  });

  // Filter transactions by account and type
  const accountTransactions = useMemo(
    () => transactions.filter((t) => t.accountId === selectedAccountId),
    [transactions, selectedAccountId]
  );

  // Get recent transactions
  const recentTransactions = useMemo(
    () =>
      accountTransactions
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5),
    [accountTransactions]
  );

  // Get recurring transactions with search filter
  const recurringTransactions = useMemo(() => {
    return accountTransactions
      .filter((transaction) => transaction.isRecurring)
      
  }, [accountTransactions, searchTerm]);

  // Calculate expense breakdown for the current month
  const currentMonthExpenses = useMemo(() => {
    const currentDate = new Date();
    return accountTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transaction.type === "EXPENSE" &&
        transactionDate.getMonth() === currentDate.getMonth() &&
        transactionDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [accountTransactions]);

  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    return currentMonthExpenses.reduce((acc, transaction) => {
      const category = transaction.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + transaction.amount;
      return acc;
    }, {});
  }, [currentMonthExpenses]);

  // Format data for pie chart
  const pieChartData = useMemo(() => {
    return Object.entries(expensesByCategory).map(([category, value]) => ({
      name: category,
      value,
    }));
  }, [expensesByCategory]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex justify-between pb-4">
          <CardTitle>Recent Transactions</CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={(value) => setSelectedAccountId(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>No accounts available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No recent transactions
            </p>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center",
                      transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    )}
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>


      
    </div>
  );
}
