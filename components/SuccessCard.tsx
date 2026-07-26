"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Send } from "lucide-react";

export default function SuccessCard() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-emerald-500/5 p-8 sm:p-12 text-center space-y-6"
      >
        {/* Large Animated Green Check Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner border border-emerald-100"
        >
          <CheckCircle2 className="w-14 h-14 text-emerald-600" />
        </motion.div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Request Submitted Successfully!
          </h1>
          <p className="text-base text-gray-600 max-w-md mx-auto">
            Our team has received your request and will contact you soon.
          </p>
        </div>

        {/* Dispatch Confirmation Card */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-2 text-left">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <Send className="w-4 h-4" />
            <span>Telegram Notification Sent</span>
          </div>
          <p>
            An automated notification containing your requirements was transmitted directly to our admin team&apos;s Telegram account.
          </p>
        </div>

        {/* Return Home Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
