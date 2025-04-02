

import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
import { getAccountWithTransactions } from "../../../../actions/accounts";
import AccountChart from "../components/account-chart";
import {TransactionTable} from "../components/transaction-table";
import Chatbot from "components/Chatbot"

import{
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

async function AccountsPage({ params: paramsPromise }) {
  const params = await paramsPromise; // Unwrap the Promise
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4"></div>
        </header>
        <div className="mt-[-165px] flex flex-1 flex-col gap-4 p-4 pt-0 ">
          <SidebarTrigger className="-ml-[80px]" />
          <div className="space-y-8 px-5 ">
            <div className="flex gap-4 items-end justify-between">
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">
                  {account.name}
                </h1>
                <p className="text-black font-bold text-muted-foreground">
                  {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
                  Account
                </p>



              </div>

              

              {/* text-[20px] sm:text-2xl font-bold gradient-title */}

              <div className="text-right pb-2">
                <div className=" text-[40px] gradient-title">
                  ${parseFloat(account.balance).toFixed(2)}
                </div>
                <p className="text-sm text-black text-muted-foreground">
                  {account._count.transactions} Transactions
                </p>
              </div>
            </div>

            <Suspense
              fallback={
                <BarLoader className="mt-2" width={"100%"} color="#9333ea" />
              }
            >
              <AccountChart transactions={transactions} />
            </Suspense>

            <Suspense
              fallback={
                <BarLoader className="mt-2" width={"100%"} color="#9333ea" />
              }
            >
              <TransactionTable transactions={transactions} />
              
            </Suspense>
          </div>
          <Chatbot/>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AccountsPage;
