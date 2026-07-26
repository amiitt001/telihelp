"use server";

import { requestFormSchema } from "@/lib/validations";
import { sendTelegramNotification } from "@/lib/telegram";
import { ActionResponse } from "@/types/request";

export async function submitHelpRequest(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = (formData.get("email") as string) || "";
    const college = (formData.get("college") as string) || "";
    const requirementType = formData.get("requirementType") as string;
    const subject = formData.get("subject") as string;
    const deadline = formData.get("deadline") as string;
    const description = formData.get("description") as string;
    const rawFile = formData.get("attachment") as File | null;

    // Validate fields with Zod
    const validationResult = requestFormSchema.safeParse({
      fullName,
      phone,
      email,
      college,
      requirementType,
      subject,
      deadline,
      description,
      attachment: rawFile && rawFile.size > 0 ? rawFile : undefined,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Invalid input";
      return {
        success: false,
        message: firstError,
        error: firstError,
      };
    }

    let attachmentData = null;
    if (rawFile && rawFile.size > 0) {
      const arrayBuffer = await rawFile.arrayBuffer();
      attachmentData = {
        filename: rawFile.name,
        buffer: Buffer.from(arrayBuffer),
        contentType: rawFile.type,
      };
    }

    const telegramResult = await sendTelegramNotification({
      name: fullName,
      phone,
      email,
      college,
      type: requirementType,
      subject,
      deadline,
      description,
      attachment: attachmentData,
    });

    if (!telegramResult.success) {
      return {
        success: false,
        message: telegramResult.error || "Failed to notify admin via Telegram",
        error: telegramResult.error,
      };
    }

    return {
      success: true,
      message: "Request submitted successfully!",
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    console.error("Server Action Exception:", err);
    return {
      success: false,
      message: "An error occurred while submitting your request. Please try again.",
      error: errorMessage,
    };
  }
}
