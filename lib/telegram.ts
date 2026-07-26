interface TelegramPayload {
  name: string;
  phone: string;
  email?: string;
  college?: string;
  type: string;
  subject: string;
  deadline: string;
  description: string;
  attachment?: {
    filename: string;
    buffer: Buffer;
    contentType: string;
  } | null;
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sendTelegramNotification(payload: TelegramPayload): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  const emailText = payload.email && payload.email.trim() !== "" ? payload.email.trim() : "Not provided";
  const collegeText = payload.college && payload.college.trim() !== "" ? payload.college.trim() : "Not provided";
  const attachmentText = payload.attachment ? payload.attachment.filename : "No Attachment";

  const messageText = `📩 <b>New Help Request</b>

👤 <b>Name:</b> ${escapeHtml(payload.name)}
📱 <b>Phone:</b> ${escapeHtml(payload.phone)}
📧 <b>Email:</b> ${escapeHtml(emailText)}
🏫 <b>College:</b> ${escapeHtml(collegeText)}

📌 <b>Requirement:</b>
${escapeHtml(payload.type)}

📚 <b>Subject:</b>
${escapeHtml(payload.subject)}

⏰ <b>Deadline:</b>
${escapeHtml(payload.deadline)}

📝 <b>Description:</b>
${escapeHtml(payload.description)}

📎 <b>Attachment:</b> ${escapeHtml(attachmentText)}`;

  console.log("==========================================");
  console.log("SENDING TELEGRAM NOTIFICATION:");
  console.log(messageText);
  console.log("==========================================");

  if (!botToken || !chatId) {
    const errorMsg = "Telegram credentials missing! Please add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to .env.local and restart dev server.";
    console.error("❌ " + errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }

  try {
    if (payload.attachment) {
      // Send Document via Telegram Bot API
      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("parse_mode", "HTML");
      formData.append("caption", messageText);

      const fileBlob = new Blob([new Uint8Array(payload.attachment.buffer)], {
        type: payload.attachment.contentType || "application/octet-stream",
      });
      formData.append("document", fileBlob, payload.attachment.filename);

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!result.ok) {
        console.error("❌ Telegram API Error (sendDocument):", result);
        return {
          success: false,
          error: `Telegram Error (${result.error_code}): ${result.description}`,
        };
      }
      return { success: true };
    } else {
      // Send Text Message via Telegram Bot API
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "HTML",
        }),
      });

      const result = await response.json();
      if (!result.ok) {
        console.error("❌ Telegram API Error (sendMessage):", result);
        return {
          success: false,
          error: `Telegram Error (${result.error_code}): ${result.description}`,
        };
      }
      return { success: true };
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Network error sending to Telegram";
    console.error("❌ Telegram Dispatch Exception:", err);
    return { success: false, error: errorMessage };
  }
}
