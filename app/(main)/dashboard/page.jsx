import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@clerk/nextjs/server";


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import Chatbot from "components/Chatbot"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus } from 'lucide-react';
import React from 'react';
import { getCurrentBudget } from '../../../actions/budget';
import { getUserAccounts, getDashboardData} from '../../../actions/dashboard';
import CreateAccountDrawer from '../../../components/create-account-drawer';
import { CardContent, Card } from '../../../components/ui/card';
import AccountCard from './_components/account-card';
import BudgetProgress from './_components/budget-progress';
import {DashboardOverview} from "app/(main)/dashboard/_components/transaction-overview"

export default function Page() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
           
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          
         
          
          {/* Dashboard Content */}
          <DashboardPage />
       
        </div>
      </SidebarInset>
    </SidebarProvider>

    
  );
}
async function DashboardPage() {
  const { userId } = await auth();
  
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-8">
      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

       

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed rounded-[30px]">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
             
              
            </CardContent>
          </Card>  
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>
      <Chatbot/>
    </div>
  );
}