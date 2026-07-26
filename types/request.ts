export type RequirementType =
  | "Assignment Help"
  | "Project Help"
  | "PPT"
  | "Report"
  | "Coding Help"
  | "Other";

export interface RequestFormData {
  fullName: string;
  phone: string;
  email?: string;
  college?: string;
  requirementType: RequirementType;
  subject: string;
  deadline: string;
  description: string;
  attachment?: File | null;
}

export interface SubmissionPayload {
  fullName: string;
  phone: string;
  email: string;
  college: string;
  requirementType: string;
  subject: string;
  deadline: string;
  description: string;
  fileName?: string;
  fileSize?: number;
  fileBufferBase64?: string;
  fileType?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type ActionResponse = {
  success: boolean;
  message: string;
  error?: string;
};
