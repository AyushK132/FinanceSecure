import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const history = await db.conversationHistory.findUnique({
      where: { userId },
    });

    return new Response(
      JSON.stringify({ messages: history ? history.messages : [] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch chat history" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
