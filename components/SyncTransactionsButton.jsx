"use client";

import { useAction } from "next-safe-action/hooks";
import { syncPlaidTransactions } from "@/actions/plaid.actions";
import { Button } from "./ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function SyncTransactionsButton() {
  const { execute, status } = useAction(syncPlaidTransactions, {
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Transactions synced successfully");
      } else {
        toast.error(data.error || "Failed to sync transactions");
      }
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => execute()}
      disabled={status === "executing"}
    >
      {status === "executing" ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Transactions
        </>
      )}
    </Button>
  );
}