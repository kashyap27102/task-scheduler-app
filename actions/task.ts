"use server";

import { db } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

type FormState = { message: string; success?: boolean };

export async function createTask(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const task = await db.task.create({
      data: {
        title: formData.get("title") as string,
        date: formData.get("date") as string,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
      },
    });
    revalidateTag("tasks");
    return { message: "✅ Task added successfully!", success: true };
  } catch (error) {
    return { message: "❌ Failed to add task.", success: false };
  }
}

export async function updateTask(formData: FormData): Promise<FormState> {
  console.log("Form Data:", Object.fromEntries(formData.entries()));
  const task = await db.task.update({
    where: { id: formData.get("id") as string },
    data: {
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
    },
  });
  revalidateTag("tasks");
  revalidatePath("/");
  return { message: "✅ Task updated successfully!", success: true };
}

export async function deleteTask(formData: FormData): Promise<FormState> {
  const task = await db.task.delete({
    where: { id: formData.get("id") as string },
  });
  revalidateTag("tasks");
  return { message: "✅ Task deleted successfully!", success: true };
}
