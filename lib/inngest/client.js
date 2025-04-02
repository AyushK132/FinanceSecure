import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "financesecure", // Unique app ID
  name: "FinanceSecure",
  retryFunction: async (attempt) => ({
    delay: Math.pow(2, attempt) * 1000, // Exponential backoff
    maxAttempts: 2,
  }),
});