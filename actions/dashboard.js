"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from '../lib/prisma';  // Ensure this import is correct
import { revalidatePath } from "next/cache";

// Helper function to serialize the account/transaction data
const serializeTransaction = (obj) => {
    const serialized = {...obj};
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;  // Ensure you're returning the serialized data
}

export async function createAccount(data) {
    try {
        // Step 1: Check authenticated user
        const {userId} = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Step 2: Fetch the user from the database using their Clerk userId
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
        });
        console.log("User found:", user);  // Debug log to check if user exists
        if (!user) {
            throw new Error("User Not Found");
        }

        // Step 3: Validate balance input
        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat) || balanceFloat < 0) {
            throw new Error("Invalid balance amount");
        }

        // Step 4: Check if the user already has accounts and determine if this should be the default account
        const existingAccounts = await db.account.findMany({
            where: { userId: user.id }
        });

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false }
            });
        }

        // Step 5: Create the new account in the database
        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault
            }
        });

        // Step 6: Serialize the account data and return it
        const serializedAccount = serializeTransaction(account);
        revalidatePath("/dashboard");

        return { success: true, data: serializedAccount };

    } catch (error) {
        console.error("Error creating account:", error.message);  // Log error
        throw new Error(error.message || "An unexpected error occurred while creating the account.");
    }
}




export async function getUserAccounts() {
    const {userId} = await auth();
    
    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Step 1: Fetch user from the database using their Clerk userId
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        },
    });

    if (!user) {
        throw new Error("User Not Found");
    }

    // Step 2: Get the list of user accounts
    const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    transactions: true,
                }
            }
        }
    });

    // Step 3: Serialize the account data
    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;
}



export async function getDashboardData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    // Get all user transactions
    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });
  
    return transactions.map(serializeTransaction);
  }