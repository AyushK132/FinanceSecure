"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { updateBudget } from "@/actions/budget";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Dash from "components/ui/animationdash"


function BudgetProgress({ initialBudget, currentExpenses, transactions }) {
  const { user } = useUser();

  if (!user) {
    return null; // You can handle a loading state or redirect here
  }

  // Move hooks initialization out of dynamic conditions
  const [isEditing, setIsEditing] = useState(false);
  const [typedValue, setTypedValue] = useState(initialBudget?.amount?.toString() || "");
  const [newBudget, setNewBudget] = useState(typedValue);

  useEffect(() => {
    // Reinitialize `newBudget` when `typedValue` changes
    setNewBudget(typedValue);
  }, [typedValue]);

  const percentUsed = useMemo(() => {
    const percent = initialBudget
      ? (currentExpenses / initialBudget.amount) * 100
      : 0;
    return Math.min(percent, 100); // Cap at 100%
  }, [initialBudget, currentExpenses]);

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget.trim());
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await updateBudgetFn(amount);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget?.success]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  const handleCancel = () => {
    setTypedValue(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  return (
    <div>
  
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium">
              Monthly Budget (Default Account)
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={typedValue}
                    onChange={(e) => setTypedValue(e.target.value)}
                    className="w-32"
                    placeholder="Enter amount"
                    autoFocus
                    disabled={isLoading}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUpdateBudget}
                    disabled={isLoading}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <>
                  <CardDescription>
                    {initialBudget
                      ? `$${currentExpenses.toFixed(2)} of $${initialBudget.amount.toFixed(
                          2
                        )} spent`
                      : "No budget set"}
                  </CardDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="h-6 w-6"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {initialBudget && (
            <div className="space-y-2">
              <Progress
                value={percentUsed}
                extraStyles={
                  percentUsed >= 90
                    ? "bg-red-500"
                    : percentUsed >= 75
                    ? "bg-yellow-500"
                    : "bg-purple-600"
                }
              />

              <p className="text-xs text-muted-foreground text-right">
                {percentUsed.toFixed(1)}% used
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Welcome Card */}
      <div className="flex flex-row gap-[20px]">
        <Card className="h-[350px] w-1/3 mt-[15px] bg-cover bg-gradient-to-r from-purple-500 to-indigo-500 text-white ">
          <CardContent>
            <div className="absolute top-[200px] left-[315px] w-[230px] h-[230px] bg-white/5 rounded-full"></div>
            <div className="absolute top-[380px] left-[230px] w-[270px] h-[270px] bg-white/5 rounded-full"></div>
            <p className="text-muted-foreground text-s mt-[30px] text-white">Welcome Back</p>
            <h1 className="font-extrabold text-indigo-500 text-[35px] mt-[90px] text-white">
              {user.fullName}
            </h1>
            <p className="text-muted-foreground text-s mt-[30px] text-white">Glad to see you again!</p>
            <p className="text-muted-foreground text-s text-white">Let's Save Money</p>
          </CardContent>
        </Card>
                    
        <Card className="h-[350px] w-2/3 mt-[15px] rounded-lg shadow-md text-white overflow-hidden  ">
  <CardContent>
    
    <Dash/>
    <div className="absolute top-[200px] left-[315px] w-[230px] h-[230px] bg-white/5 rounded-full"></div>
    <div className="absolute top-[380px] left-[230px] w-[270px] h-[270px] bg-white/5 rounded-full"></div>
   
  </CardContent>
</Card>

      </div>
    </div>
  );
}

export default BudgetProgress;
