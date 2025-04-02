"use client"
import Link from 'next/link'
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";
import useFetch from "../../../../hooks/use-fetch";
import { updateDefaultAccount, deleteAccount } from "../../../../actions/accounts";
import { toast } from "sonner";
import CountUp from "react-countup";

// Dynamically import useRouter for client-side use only
import { useRouter } from 'next/navigation';

function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  // Use router hook in client-side only
  const router = useRouter(); // This works on the client side now

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const {
    loading: deleteAccountLoading,
    fn: deleteAccountFn,
    data: deleteAccountData,
    error: deleteAccountError,
  } = useFetch(deleteAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }

    await updateDefaultFn(id);
  };

  const handleDelete = (event) => {
    // Prevent the click event from triggering the link navigation
    event.stopPropagation();

    // Trigger the confirmation toast immediately when the delete button is clicked
    const toastId = toast.custom((t) => (
      <div className="flex flex-col content-center bg-red-300 rounded-[20px]  ">
        <p className = "mt-[5px] ml-[5px]">Are you sure you want to delete this account?</p>
        <p className = "flex justify-center">This action cannot be undone.</p>
        <div className="flex justify-end mt-2 space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id); // Dismiss confirmation toast
              await deleteAccountFn(id); // Perform delete action
              toast.success("Account deleted successfully!"); // Show success toast
              router.push("/dashboard"); // Navigate away from the current page after deletion
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600"
          >
            Confirm
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id); // Dismiss confirmation toast
            }}
            className="px-3 py-1 bg-gray-200 text-black rounded-xl hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  useEffect(() => {
    if (deleteAccountData?.success) {
      toast.success("Account deleted successfully!");
    }
  }, [deleteAccountData]);

  useEffect(() => {
    if (deleteAccountError) {
      toast.error(deleteAccountError.message || "Failed to delete the account.");
    }
  }, [deleteAccountError]);

  return (
    <Card className="hover:shadow-lg transition-shadow transform hover:translate-y-[-10px] transition-transform duration-300 group relative mt-4 min-h-[275px] bg-gradient-to-br from-indigo-600 to-purple-400 bg-cover bg-center bg-no-repeat bg-[length:100%_380px] rounded-[20px] ">
      <Link href={`/account/${id}`} passHref>
        <div className="cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-white font-medium capitalize">
              {name}
            </CardTitle>
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
            />
          </CardHeader>
          
          <div className="absolute top-[200px] left-[130px] w-[200px] h-[200px] bg-white/5 rounded-full"></div>
          <div className="absolute top-[100px] left-[-20px] w-[200px] h-[200px] bg-white/5 rounded-full"></div>
          <CardContent>
            <div className="text-2xl text-white font-bold">
              <CountUp
                end={parseFloat(balance).toFixed(2)}
                decimals={2}
                decimal="."
                prefix="$"
                duration={4}
              />
            </div>
            <p className="text-xs text-white text-muted-foreground">
              {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
            </p>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-white text-muted-foreground">
            <div className="flex items-center text-green-500 font-bold">
              <ArrowUpRight className="mr-1 w-4 h-4 text-green-500" /> Income
            </div>
            <div className="flex items-center text-red-500 font-bold">
              <ArrowDownRight className="mr-1 w-4 h-4 text-red-500" /> Expense
            </div>
          </CardFooter>
        </div>
      </Link>
      <button
        onClick={(event) => handleDelete(event)}
        disabled={deleteAccountLoading}
        className="hover:shadow-md transition-shadow transform hover:translate-y-[-10px] transition-transform duration-300 absolute bottom-2 right-2 text-white bg-white-500 border border-white rounded-full p-2"
      >
        <Trash2 className="w-4 h-4 text-white" />
      </button>
    </Card>
  );
}

export default AccountCard;
