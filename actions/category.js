"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function createCategory(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const newCategory = await db.category.create({
      data: {
        name: data.name,
        type: data.type,
        userId: user.id, // Associate category with user
      },
    });

    return { success: true, data: newCategory };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
