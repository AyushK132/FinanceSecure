// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Fetch account data for the user
// async function getAccountData(userId) {
//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   const accounts = await db.account.findMany({
//     where: { userId: user.id },
//     include: {
//       transactions: {
//         orderBy: { date: "desc" },
//       },
//     },
//   });

//   return accounts;
// }

// // Fetch budget data for the user
// async function getBudgetData(userId) {
//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   const budget = await db.budget.findFirst({
//     where: {
//       userId: user.id,
//     },
//   });

//   // Get current month's expenses
//   const currentDate = new Date();
//   const startOfMonth = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth(),
//     1
//   );
//   const endOfMonth = new Date(
//     currentDate.getFullYear(),
//     currentDate.getMonth() + 1,
//     0
//   );

//   const expenses = await db.transaction.aggregate({
//     where: {
//       userId: user.id,
//       type: "EXPENSE",
//       date: {
//         gte: startOfMonth,
//         lte: endOfMonth,
//       },
//     },
//     _sum: {
//       amount: true,
//     },
//   });

//   return {
//     budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
//     currentExpenses: expenses._sum.amount
//       ? expenses._sum.amount.toNumber()
//       : 0,
//   };
// }

// // AI Suggestions based on the user's financial data
// async function getAISuggestions(userId) {
//   try {
//     const accounts = await getAccountData(userId); // Fetch account data
//     const { budget, currentExpenses } = await getBudgetData(userId); // Fetch budget and expenses data

//     const suggestions = [];

//     // Suggest if the expenses exceed the budget
//     if (budget && currentExpenses > budget.amount.toNumber()) {
//       suggestions.push("You're exceeding your budget this month. Consider reducing discretionary spending.");
//     }

//     // Suggest savings if income is significantly higher than expenses
//     const totalIncome = accounts
//       .map(account => account.transactions
//         .filter(tx => tx.type === "INCOME")
//         .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
//       )
//       .reduce((sum, income) => sum + income, 0);

//     if (totalIncome > currentExpenses + 100) { // Example threshold
//       suggestions.push("You have a surplus this month. Consider setting aside some savings.");
//     }

//     // Suggest optimizing recurring payments
//     accounts.forEach(account => {
//       const recurringExpenses = account.transactions.filter(tx => tx.isRecurring);
//       if (recurringExpenses.length > 0) {
//         suggestions.push("You have recurring payments. Consider reviewing them to optimize spending.");
//       }
//     });

//     // Create AI-powered suggestions (use AI model to generate advanced suggestions)
//     const prompt = `
//       Based on the user's financial data, suggest some improvements or actions:
//       Accounts and Transactions: ${accounts.map(account => account.transactions.map(tx => `${tx.type}: $${tx.amount.toFixed(2)} on ${tx.date.toISOString()}`).join(", ")).join("\n")}
//       Budget info: ${budget ? `Budget: $${budget.amount.toFixed(2)}, Current Expenses: $${currentExpenses.toFixed(2)}` : "No budget set."}
//       Provide suggestions based on the above information.
//     `;
    
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const aiSuggestions = response.text(); // AI suggestions

//     // Combine basic suggestions with AI suggestions
//     suggestions.push(aiSuggestions);

//     return suggestions;
//   } catch (error) {
//     console.error("Error generating AI suggestions:", error);
//     throw new Error("Failed to generate AI suggestions");
//   }
// }

// // Chatbot (Existing functionality)
// export async function POST(req) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     const { message } = await req.json();
//     if (!message) {
//       return new Response(
//         JSON.stringify({ message: "Message is required" }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Fetch user data (accounts and budget)
//     const accounts = await getAccountData(userId);
//     const { budget, currentExpenses } = await getBudgetData(userId);

//     // Create structured data for the AI prompt
//     const accountInfo = accounts
//       .map((account) => {
//         const totalIncome = account.transactions
//           .filter(tx => tx.type === "INCOME")
//           .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
//         const totalExpenses = account.transactions
//           .filter(tx => tx.type === "EXPENSE")
//           .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

//         const transactionDetails = account.transactions
//           .map(tx => {
//             return `
//               Type: ${tx.type} | Amount: $${tx.amount.toFixed(2)} on ${tx.date.toISOString()}
//               Description: ${tx.description || "No description"}
//               Merchant: ${tx.merchantName || "N/A"}
//               Category: ${tx.category || "Uncategorized"}
//             `;
//           })
//           .join("\n");

//         return `
//           Account: ${account.name}, Balance: $${account.balance.toNumber()}
//           Total Income: $${totalIncome.toFixed(2)}
//           Total Expenses: $${totalExpenses.toFixed(2)}
//           Recent Transactions:
//           ${transactionDetails}
//         `;
//       })
//       .join("\n");

//     // Budget info
//     const budgetInfo = budget
//       ? `Your current budget is $${budget.amount.toFixed(2)}. You have spent $${currentExpenses.toFixed(2)} this month.`
//       : "No budget has been set.";

//     // Construct the AI prompt
//     const prompt = `
//       You are a financial assistant. Answer the following question based on the user's financial data with a max of 3 sentences if needed otherwise less:
//       \nUser's Accounts and Transactions:
//       ${accountInfo}
//       \nUser's Budget:
//       ${budgetInfo}
//       \nUser's question: "${message}"
//     `;

//     // Send the prompt to the AI model
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return new Response(
//       JSON.stringify({ reply: text }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return new Response(
//       JSON.stringify({ message: "Failed to generate response" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }

// // New GET route for AI suggestions
// export async function GET(req) {
//   try {
//     const { userId } = await auth();
//     if (!userId) throw new Error("Unauthorized");

//     // Get AI suggestions for the user
//     const suggestions = await getAISuggestions(userId);

//     return new Response(
//       JSON.stringify({ suggestions }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return new Response(
//       JSON.stringify({ message: "Failed to fetch AI suggestions" }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }import { db } from "@/lib/prisma";
// app/api/chatbot/route.js (Backend)
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAccountData(userId) {
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
    },
  });

  return accounts;
}

async function getBudgetData(userId) {
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const budget = await db.budget.findFirst({
    where: {
      userId: user.id,
    },
  });

  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const expenses = await db.transaction.aggregate({
    where: {
      userId: user.id,
      type: "EXPENSE",
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
    currentExpenses: expenses._sum.amount
      ? expenses._sum.amount.toNumber()
      : 0,
  };
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { message, previousChatHistory } = await req.json();
    if (!message) {
      return new Response(
        JSON.stringify({ message: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch user data (accounts and budget)
    const accounts = await getAccountData(userId);
    const { budget, currentExpenses } = await getBudgetData(userId);

    // Create structured data for the AI prompt
    const accountInfo = accounts
      .map((account) => {
        const totalIncome = account.transactions
          .filter((tx) => tx.type === "INCOME")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
        const totalExpenses = account.transactions
          .filter((tx) => tx.type === "EXPENSE")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

        const transactionDetails = account.transactions
          .map((tx) => {
            return `
              Type: ${tx.type} | Amount: $${tx.amount.toFixed(2)} on ${tx.date.toISOString()}
              Description: ${tx.description || "No description"}
              Merchant: ${tx.merchantName || "N/A"}
              Category: ${tx.category || "Uncategorized"}
            `;
          })
          .join("\n");

        return `
          Account: ${account.name}, Balance: $${account.balance.toNumber()}
          Total Income: $${totalIncome.toFixed(2)}
          Total Expenses: $${totalExpenses.toFixed(2)}
          Recent Transactions:
          ${transactionDetails}
        `;
      })
      .join("\n");

    // Budget info
    const budgetInfo = budget
      ? `Your current budget is $${budget.amount.toFixed(2)}. You have spent $${currentExpenses.toFixed(2)} this month.`
      : "No budget has been set.";

    // Construct the AI prompt with conversation context
    const prompt = `
      You are a financial assistant. Answer the following question based on the user's financial data with a max of 3 sentences if needed otherwise less:
      \nUser's Accounts and Transactions:
      ${accountInfo}
      \nUser's Budget:
      ${budgetInfo}
      \nPrevious conversation context: ${previousChatHistory}
      \nUser's question: "${message}"
    `;

    // Send the prompt to the AI model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(
      JSON.stringify({ reply: text }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(
      JSON.stringify({ message: `Failed to generate response: ${error.message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
