import { NextRequest, NextResponse } from "next/server";
import { requestFormSchema } from "@/lib/validations";
import { sendWhatsAppMessage, sendDocument } from "@/lib/openwa";
import { sendTelegramNotification } from "@/lib/telegram";
import { logger } from "@/utils/logger";

/**
 * POST /api/contact
 *
 * Handles contact form submissions, validates payloads using Zod,
 * formats notification messages, and sends notifications to BOTH
 * WhatsApp (via OpenWA REST API) and Telegram (via Telegram Bot API).
 */
export async function POST(req: NextRequest) {
  try {
    logger.info("Received POST /api/contact request");

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      logger.warn("Invalid Content-Type or corrupted FormData in request.");
      return NextResponse.json(
        { success: false, error: "Invalid form data format. Please submit multipart/form-data." },
        { status: 400 }
      );
    }

    const fullName = (formData.get("fullName") as string) || "";
    const phone = (formData.get("phone") as string) || "";
    const email = (formData.get("email") as string) || "";
    const college = (formData.get("college") as string) || "";
    const requirementType = (formData.get("requirementType") as string) || "";
    const subject = (formData.get("subject") as string) || "";
    const deadline = (formData.get("deadline") as string) || "";
    const description = (formData.get("description") as string) || "";
    const rawFile = formData.get("attachment") as File | null;

    // Validate fields using Zod schema
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
      const firstIssue = validationResult.error.issues[0]?.message || "Validation failed";
      logger.warn("Form validation failed:", firstIssue);
      return NextResponse.json(
        {
          success: false,
          error: firstIssue,
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Prepare attachment buffer if present
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

    // 1. Dispatch to WhatsApp and Telegram in parallel
    const [waTextResult, telegramResult] = await Promise.all([
      // WhatsApp Text Notification
      sendWhatsAppMessage(formattedWaMessage),

      // Telegram Notification
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

    // 2. Dispatch WhatsApp Document Attachment (if present and text succeeded/attempted)
    let waDocumentResult = null;
    if (rawFile && attachmentBuffer) {
      logger.info(`Processing WhatsApp attachment: ${rawFile.name} (${rawFile.size} bytes)`);

      const base64 = attachmentBuffer.toString("base64");
      waDocumentResult = await sendDocument(
        {
          base64,
          filename: rawFile.name,
          mimetype: rawFile.type || "application/octet-stream",
        },
        `Attachment from ${data.fullName}`
      );
    }

    logger.info("Notification Dispatch Results:", {
      whatsappText: waTextResult.success ? "SUCCESS" : waTextResult.error,
      whatsappDocument: waDocumentResult ? (waDocumentResult.success ? "SUCCESS" : waDocumentResult.error) : "N/A",
      telegram: telegramResult.success ? "SUCCESS" : telegramResult.error,
    });

    // Check if at least one service succeeded
    if (!waTextResult.success && !telegramResult.success) {
      logger.error("Both WhatsApp and Telegram dispatches failed!");
      return NextResponse.json(
        {
          success: false,
          error: waTextResult.error || telegramResult.error || "Failed to deliver admin notifications",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your request has been submitted successfully!",
        whatsapp: {
          success: waTextResult.success,
          messageId: waTextResult.messageId,
          documentMessageId: waDocumentResult?.messageId,
          error: waTextResult.error,
        },
        telegram: {
          success: telegramResult.success,
          error: telegramResult.error,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "An unexpected server error occurred";
    logger.error("Unhandled error in POST /api/contact:", errorMsg);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your request.",
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}
