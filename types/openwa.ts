export interface OpenWASendTextPayload {
  chatId: string;
  text: string;
  mentions?: string[];
}

export interface OpenWASendDocumentPayload {
  chatId: string;
  url?: string;
  base64?: string;
  mimetype?: string;
  filename?: string;
  caption?: string;
  mentions?: string[];
}

export interface OpenWASuccessResponse {
  messageId: string;
  timestamp: number;
}

export interface OpenWAErrorResponse {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

export interface OpenWAServiceResult {
  success: boolean;
  messageId?: string;
  error?: string;
  errorCode?: "SERVER_OFFLINE" | "SESSION_DISCONNECTED" | "INVALID_API_KEY" | "SESSION_NOT_FOUND" | "UNKNOWN_ERROR";
}

export interface ContactSubmissionData {
  name: string;
  phone: string;
  email?: string;
  college?: string;
  requirementType: string;
  subject: string;
  deadline: string;
  description: string;
}
