import { logger } from "@/utils/logger";
import { OpenWAServiceResult } from "@/types/openwa";

/**
 * OpenWA Environment Configuration
 */
function getOpenWAConfig() {
  const url = (process.env.OPENWA_URL || "http://localhost:2785").replace(/\/+$/, "");
  const apiKey = process.env.OPENWA_API_KEY || "";
  const sessionId = process.env.OPENWA_SESSION_ID || process.env.SESSION_ID || "";
  const adminChat = process.env.OPENWA_ADMIN_CHAT || "";

  return { url, apiKey, sessionId, adminChat };
}

/**
 * Standard headers required for OpenWA REST API requests
 */
function getHeaders(apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Bypass-Tunnel-Reminder": "true",
  };
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  return headers;
}

/**
 * Formats error responses into user-friendly messages and error codes
 */
function parseOpenWAError(status: number, responseData: unknown): { error: string; errorCode: OpenWAServiceResult["errorCode"] } {
  const messageStr = typeof responseData === "object" && responseData !== null && "message" in responseData
    ? Array.isArray((responseData as { message: unknown }).message)
      ? ((responseData as { message: string[] }).message).join(", ")
      : String((responseData as { message: unknown }).message)
    : "";

  if (status === 401 || status === 403) {
    return {
      error: "Invalid OpenWA API key provided.",
      errorCode: "INVALID_API_KEY",
    };
  }

  if (status === 404) {
    return {
      error: `OpenWA session not found. ${messageStr}`.trim(),
      errorCode: "SESSION_NOT_FOUND",
    };
  }

  if (status === 400) {
    if (messageStr.toLowerCase().includes("not active") || messageStr.toLowerCase().includes("disconnected")) {
      return {
        error: "OpenWA session is disconnected or not active. Please reconnect WhatsApp.",
        errorCode: "SESSION_DISCONNECTED",
      };
    }
    return {
      error: `OpenWA Bad Request: ${messageStr || "Invalid parameters"}`,
      errorCode: "UNKNOWN_ERROR",
    };
  }

  return {
    error: `OpenWA error (${status}): ${messageStr || "Operation failed"}`,
    errorCode: "UNKNOWN_ERROR",
  };
}

/**
 * Generic helper to execute an OpenWA API request with 1x retry
 */
async function fetchWithRetry(
  endpointUrl: string,
  options: RequestInit,
  attempt: number = 1
): Promise<Response> {
  try {
    const response = await fetch(endpointUrl, options);

    // If server returned 5xx server error on first attempt, retry once
    if (response.status >= 500 && attempt === 1) {
      logger.warn(`OpenWA server returned HTTP ${response.status}. Retrying attempt 2 in 1s...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await fetch(endpointUrl, options);
    }

    return response;
  } catch (err) {
    if (attempt === 1) {
      logger.warn(`OpenWA fetch error (${err instanceof Error ? err.message : String(err)}). Retrying attempt 2 in 1s...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await fetch(endpointUrl, options);
    }
    throw err;
  }
}

/**
 * Check if the OpenWA session is connected and ready
 */
export async function checkSessionStatus(): Promise<{ ready: boolean; error?: string }> {
  const { url, apiKey, sessionId } = getOpenWAConfig();

  if (!sessionId) {
    return { ready: false, error: "OPENWA_SESSION_ID is not configured in environment variables." };
  }

  try {
    const sessionEndpoint = `${url}/api/sessions/${sessionId}`;
    logger.info(`Checking OpenWA session status at: ${sessionEndpoint}`);

    const res = await fetchWithRetry(sessionEndpoint, {
      method: "GET",
      headers: getHeaders(apiKey),
    });

    if (res.status === 401 || res.status === 403) {
      return { ready: false, error: "Invalid OpenWA API key." };
    }

    if (!res.ok) {
      return { ready: false, error: `Session check failed with status ${res.status}` };
    }

    const data = (await res.json()) as { status?: string };
    if (data.status === "ready" || data.status === "authenticated" || data.status === "CONNECTED") {
      return { ready: true };
    }

    return { ready: false, error: `OpenWA session status is '${data.status || "unknown"}' (not ready).` };
  } catch (err) {
    logger.error("OpenWA server check failed:", err);
    return { ready: false, error: "OpenWA server is offline or unreachable." };
  }
}

/**
 * Send a WhatsApp text message to the specified or configured admin chat
 *
 * Requirements:
 * - Uses POST {OPENWA_URL}/api/sessions/{OPENWA_SESSION_ID}/messages/send-text
 *   (or fallback to {OPENWA_URL}/api/messages/send-text if OPENWA_URL is configured as a full path)
 * - Retries once if temporarily unavailable
 * - Handles offline server, invalid API key, and disconnected session errors cleanly
 */
export async function sendWhatsAppMessage(
  message: string,
  targetChatId?: string
): Promise<OpenWAServiceResult> {
  const { url, apiKey, sessionId, adminChat } = getOpenWAConfig();
  const chatId = targetChatId || adminChat;

  if (!sessionId) {
    logger.error("OPENWA_SESSION_ID environment variable is missing.");
    return {
      success: false,
      error: "OPENWA_SESSION_ID environment variable is missing.",
      errorCode: "SESSION_NOT_FOUND",
    };
  }

  if (!chatId) {
    logger.error("OPENWA_ADMIN_CHAT environment variable is missing.");
    return {
      success: false,
      error: "OPENWA_ADMIN_CHAT environment variable is missing.",
      errorCode: "UNKNOWN_ERROR",
    };
  }

  // Construct target endpoint
  const endpoint = url.includes(`/sessions/${sessionId}`)
    ? `${url}/messages/send-text`
    : `${url}/api/sessions/${sessionId}/messages/send-text`;

  const payload = {
    chatId,
    text: message,
  };

  logger.info(`Sending WhatsApp message to ${chatId} via ${endpoint}`);

  try {
    const response = await fetchWithRetry(endpoint, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify(payload),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const parsed = parseOpenWAError(response.status, responseData);
      logger.error(`Failed to send WhatsApp text message:`, parsed.error);
      return {
        success: false,
        error: parsed.error,
        errorCode: parsed.errorCode,
      };
    }

    const messageId = (responseData as { messageId?: string }).messageId || "sent";
    logger.info(`WhatsApp text message sent successfully. Message ID: ${messageId}`);

    return {
      success: true,
      messageId,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("OpenWA server is offline or network request failed:", errorMsg);

    return {
      success: false,
      error: "OpenWA server is offline or unreachable.",
      errorCode: "SERVER_OFFLINE",
    };
  }
}

/**
 * Send a document/file attachment via WhatsApp using OpenWA REST API
 *
 * Supports URL or Base64 media data payload
 */
export async function sendDocument(
  fileData: { url?: string; base64?: string; mimetype?: string; filename?: string },
  caption?: string,
  targetChatId?: string
): Promise<OpenWAServiceResult> {
  const { url, apiKey, sessionId, adminChat } = getOpenWAConfig();
  const chatId = targetChatId || adminChat;

  if (!sessionId) {
    return {
      success: false,
      error: "OPENWA_SESSION_ID environment variable is missing.",
      errorCode: "SESSION_NOT_FOUND",
    };
  }

  if (!chatId) {
    return {
      success: false,
      error: "OPENWA_ADMIN_CHAT environment variable is missing.",
      errorCode: "UNKNOWN_ERROR",
    };
  }

  const endpoint = url.includes(`/sessions/${sessionId}`)
    ? `${url}/messages/send-document`
    : `${url}/api/sessions/${sessionId}/messages/send-document`;

  const payload = {
    chatId,
    url: fileData.url,
    base64: fileData.base64,
    mimetype: fileData.mimetype,
    filename: fileData.filename,
    caption: caption || undefined,
  };

  logger.info(`Sending WhatsApp document to ${chatId} via ${endpoint}`);

  try {
    const response = await fetchWithRetry(endpoint, {
      method: "POST",
      headers: getHeaders(apiKey),
      body: JSON.stringify(payload),
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const parsed = parseOpenWAError(response.status, responseData);
      logger.error(`Failed to send WhatsApp document:`, parsed.error);
      return {
        success: false,
        error: parsed.error,
        errorCode: parsed.errorCode,
      };
    }

    const messageId = (responseData as { messageId?: string }).messageId || "sent";
    logger.info(`WhatsApp document sent successfully. Message ID: ${messageId}`);

    return {
      success: true,
      messageId,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error("OpenWA server offline or document send failed:", errorMsg);

    return {
      success: false,
      error: "OpenWA server is offline or unreachable.",
      errorCode: "SERVER_OFFLINE",
    };
  }
}
