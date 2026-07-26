import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export const requestFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number (at least 10 digits)")
    .max(15, "Phone number is too long")
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
      "Please enter a valid phone number format"
    ),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  college: z.string().max(120, "College/University name is too long").optional().or(z.literal("")),
  requirementType: z.enum(
    [
      "Assignment Help",
      "Project Help",
      "PPT",
      "Report",
      "Coding Help",
      "Other",
    ],
    {
      message: "Please select a requirement type",
    }
  ),
  subject: z
    .string()
    .min(2, "Subject or technology details are required")
    .max(150, "Subject name is too long"),
  deadline: z
    .string()
    .min(1, "Please specify your target deadline"),
  description: z
    .string()
    .min(10, "Please provide a brief description (at least 10 characters)")
    .max(3000, "Description exceeds 3000 characters"),
  attachment: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      "File size must be less than 10MB"
    ),
});

export type RequestFormValues = z.infer<typeof requestFormSchema>;
