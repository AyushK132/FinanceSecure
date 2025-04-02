"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import plaidClient from "@/lib/plaid";

// Helper to serialize decimal values
const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

// Create a Plaid link token for the client
export async function createLinkToken() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: "Finance Tracker",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      language: "en",
      webhook: process.env.PLAID_WEBHOOK_URL,
      redirect_uri: process.env.PLAID_REDIRECT_URI,
    });

    return { success: true, linkToken: response.data.link_token };
  } catch (error) {
    console.error("Error creating link token:", error);
    return { success: false, error: error.message };
  }
}

// Exchange public token for access token and create linked account
export async function exchangePublicToken(publicToken) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Exchange public token for access token
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    // Create accounts in our database
    const createdAccounts = [];
    
    for (const accountData of accountsResponse.data.accounts) {
      const account = await db.account.create({
        data: {
          name: accountData.name,
          type: "BANK", // Using your AccountType enum
          balance: accountData.balances.current || 0,
          userId: user.id,
          plaidAccessToken: accessToken,
          plaidItemId: itemId,
          plaidAccountId: accountData.account_id,
        },
      });
      createdAccounts.push(serializeDecimal(account));
    }

    // Fetch initial transactions (last 30 days)
    await syncPlaidTransactions(userId);

    revalidatePath("/dashboard");
    return { success: true, accounts: createdAccounts };
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return { success: false, error: error.message };
  }
}

// Sync transactions from Plaid
export async function syncPlaidTransactions(userId = null) {
  try {
    if (!userId) {
      const authResult = await auth();
      userId = authResult.userId;
    }
    
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get all linked Plaid accounts for this user
    const plaidAccounts = await db.account.findMany({
      where: {
        userId: user.id,
        plaidAccessToken: { not: null },
      },
    });

    if (plaidAccounts.length === 0) {
      return { success: true, message: "No linked Plaid accounts found" };
    }

    let totalTransactionsAdded = 0;

    for (const account of plaidAccounts) {
      // Get transactions since the last sync (or last 30 days if first sync)
      const lastTransaction = await db.transaction.findFirst({
        where: { accountId: account.id },
        orderBy: { date: "desc" },
      });

      const startDate = lastTransaction
        ? new Date(lastTransaction.date)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      
      const endDate = new Date();

      const response = await plaidClient.transactionsGet({
        access_token: account.plaidAccessToken,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        options: {
          account_ids: [account.plaidAccountId],
        },
      });

      const transactions = response.data.transactions;

      // Process and store new transactions
      for (const plaidTransaction of transactions) {
        // Check if transaction already exists
        const existingTransaction = await db.transaction.findFirst({
          where: {
            accountId: account.id,
            description: plaidTransaction.name,
            amount: plaidTransaction.amount,
            date: new Date(plaidTransaction.date),
          },
        });

        if (!existingTransaction) {
          // Determine transaction type based on amount
          const type = plaidTransaction.amount >= 0 ? "INCOME" : "EXPENSE";

          await db.transaction.create({
            data: {
              type,
              amount: Math.abs(plaidTransaction.amount),
              description: plaidTransaction.name,
              date: new Date(plaidTransaction.date),
              category: plaidTransaction.category?.[0] || "other-expense",
              userId: user.id,
              accountId: account.id,
            },
          });

          totalTransactionsAdded++;
        }
      }

      // Update account balance
      const accountData = response.data.accounts.find(
        (a) => a.account_id === account.plaidAccountId
      );
      
      if (accountData) {
        await db.account.update({
          where: { id: account.id },
          data: { balance: accountData.balances.current },
        });
      }
    }

    revalidatePath("/dashboard");
    return { 
      success: true, 
      message: `Synced ${totalTransactionsAdded} new transactions` 
    };
  } catch (error) {
    console.error("Error syncing Plaid transactions:", error);
    return { success: false, error: error.message };
  }
}

// Get all linked Plaid accounts
export async function getLinkedPlaidAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
        plaidAccessToken: { not: null },
      },
    });

    return { 
      success: true, 
      accounts: accounts.map(serializeDecimal) 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Remove a linked Plaid account
export async function removePlaidAccount(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // First check if this is a Plaid account
    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    if (!account) throw new Error("Account not found");
    if (!account.plaidAccessToken) {
      throw new Error("Not a Plaid-linked account");
    }

    // Remove the item from Plaid
    await plaidClient.itemRemove({
      access_token: account.plaidAccessToken,
    });

    // Delete the account (this will cascade delete transactions)
    await db.account.delete({
      where: { id: accountId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}