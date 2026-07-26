"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestFormSchema, RequestFormValues } from "@/lib/validations";
import {
  Upload,
  File,
  X,
  Loader2,
  AlertCircle,
  Send,
  Calendar,
  BookOpen,
  User,
  Phone,
  Mail,
  Building2,
} from "lucide-react";
import { RequirementType } from "@/types/request";

const REQUIREMENT_OPTIONS: RequirementType[] = [
  "Assignment Help",
  "Project Help",
  "PPT",
  "Report",
  "Coding Help",
  "Other",
];

export default function ContactForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const defaultType = (searchParams.get("type") as RequirementType) || "Assignment Help";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      college: "",
      requirementType: REQUIREMENT_OPTIONS.includes(defaultType) ? defaultType : "Assignment Help",
      subject: "",
      deadline: "",
      description: "",
    },
  });

  useEffect(() => {
    const typeParam = searchParams.get("type") as RequirementType;
    if (typeParam && REQUIREMENT_OPTIONS.includes(typeParam)) {
      setValue("requirementType", typeParam);
    }
  }, [searchParams, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File size exceeds 10MB limit.");
        setSelectedFile(null);
        setValue("attachment", null);
        return;
      }
      setSelectedFile(file);
      setValue("attachment", file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
    setValue("attachment", null);
  };

  const onSubmit = (data: RequestFormValues) => {
    setServerError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("phone", data.phone);
      formData.append("email", data.email || "");
      formData.append("college", data.college || "");
      formData.append("requirementType", data.requirementType);
      formData.append("subject", data.subject);
      formData.append("deadline", data.deadline);
      formData.append("description", data.description);

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          body: formData,
        });

        const res = await response.json();

        if (response.ok && res.success) {
          router.push("/success");
        } else {
          setServerError(res.error || res.message || "Failed to submit request. Please try again.");
        }
      } catch {
        setServerError("Failed to connect to the server. Please check your internet connection.");
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-500/5 p-6 sm:p-10">
      
      {/* Form Title & Subtitle */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
          <Send className="w-3.5 h-3.5" />
          <span>Instant Telegram & WhatsApp Admin Notification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Submit Your Request
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Fill in the details below and our team will get in touch with you immediately.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold">Submission Failed</p>
            <p>{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Full Name & Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. John Doe"
                {...register("fullName")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.fullName ? "border-red-500 bg-red-50/20" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-gray-900 transition-all`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                placeholder="e.g. +1 234 567 8900"
                {...register("phone")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.phone ? "border-red-500 bg-red-50/20" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-gray-900 transition-all`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Email & College */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Address <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.email ? "border-red-500 bg-red-50/20" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-gray-900 transition-all`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              College / University <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. Stanford University"
                {...register("college")}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-gray-900 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Requirement Type & Subject/Technology */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Requirement Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("requirementType")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-gray-900 bg-white transition-all"
            >
              {REQUIREMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.requirementType && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {errors.requirementType.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Subject / Technology <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="e.g. React.js, Python, Java, Data Structures"
                {...register("subject")}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.subject ? "border-red-500 bg-red-50/20" : "border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-gray-900 transition-all`}
              />
            </div>
            {errors.subject && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.subject.message}</p>
            )}
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Target Deadline <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Tomorrow by 5 PM, or July 30th"
              {...register("deadline")}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.deadline ? "border-red-500 bg-red-50/20" : "border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-gray-900 transition-all`}
            />
          </div>
          {errors.deadline && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.deadline.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Please detail your problem statement, features required, formatting rules, or special instructions..."
            {...register("description")}
            className={`w-full p-4 rounded-xl border ${
              errors.description ? "border-red-500 bg-red-50/20" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-sm text-gray-900 transition-all`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Optional File Attachment */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Attachment <span className="text-gray-400 font-normal">(Optional - Max 10MB)</span>
          </label>

          {!selectedFile ? (
            <label className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-blue-50/20 group">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2 transition-colors" />
              <p className="text-sm font-semibold text-gray-700">
                Click or drag file to attach
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports PDF, DOCX, ZIP, PNG, JPG (up to 10MB)
              </p>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.txt"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <File className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {fileError && (
            <p className="mt-1 text-xs text-red-600 font-medium">{fileError}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 px-8 rounded-xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Request to Admin...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Requirement Now</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            Instant Telegram & WhatsApp Alert • 100% Confidential • Fast Reply
          </p>
        </div>

      </form>
    </div>
  );
}
