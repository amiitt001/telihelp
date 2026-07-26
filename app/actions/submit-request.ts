"use server";

import { requestFormSchema } from "@/lib/validations";
import { sendWhatsAppMessage, sendDocument } from "@/lib/openwa";
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

    const data = validationResult.data;

    let attachmentBuffer: Buffer | null = null;
    if (rawFile && rawFile.size > 0) {
      const arrayBuffer = await rawFile.arrayBuffer();
      attachmentBuffer = Buffer.from(arrayBuffer);
    }

    // Format WhatsApp message
    const formattedWaMessage = [
      "📩 *New Assignment Request*",
      "",
      "👤 *Name:*",
      data.fullName,
      "",
      "📞 *Phone:*",
      data.phone,
      "",
      "📧 *Email:*",
      data.email || "N/A",
      "",
      "🏫 *College:*",
      data.college || "N/A",
      "",
      "📌 *Requirement:*",
      data.requirementType,
      "",
      "📚 *Subject:*",
      data.subject,
      "",
      "⏰ *Deadline:*",
      data.deadline,
      "",
      "📝 *Description:*",
      data.description,
    ].join("\n");

    // Dispatch to WhatsApp and Telegram in parallel
    const [waResult, telegramResult] = await Promise.all([
      sendWhatsAppMessage(formattedWaMessage),
      sendTelegramNotification({
        name: data.fullName,
        phone: data.phone,
        email: data.email,
        college: data.college,
        type: data.requirementType,
        subject: data.subject,
        deadline: data.deadline,
        description: data.description,
        attachment: rawFile && attachmentBuffer ? {
          filename: rawFile.name,
          buffer: attachmentBuffer,
          contentType: rawFile.type || "application/octet-stream",
        } : null,
      }),
    ]);

    if (rawFile && attachmentBuffer) {
      const base64 = attachmentBuffer.toString("base64");
      await sendDocument(
        {
          base64,
          filename: rawFile.name,
          mimetype: rawFile.type || "application/octet-stream",
        },
        `Attachment from ${data.fullName}`
      );
    }

    if (!waResult.success && !telegramResult.success) {
      return {
        success: false,
        message: "Failed to notify admin via WhatsApp or Telegram",
        error: waResult.error || telegramResult.error,
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
