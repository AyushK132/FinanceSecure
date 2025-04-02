"use client";

import { useAction } from "next-safe-action/hooks";
import { createLinkToken } from "@/actions/plaid.actions";
import { usePlaidLink } from "react-plaid-link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function PlaidLinkButton({ onSuccess }) {
  const [linkToken, setLinkToken] = useState(null);
  
  const { execute: createToken, status: tokenStatus } = useAction(createLinkToken, {
    onSuccess: (data) => {
      if (data.success) {
        setLinkToken(data.linkToken);
      }
    },
  });

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (publicToken) => {
      onSuccess(publicToken);
    },
  });

  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <Button
      onClick={() => createToken()}
      disabled={tokenStatus === "executing"}
    >
      {tokenStatus === "executing" ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Bank Account"
      )}
    </Button>
  );
}