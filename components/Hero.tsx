"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Send } from "lucide-react";

export default function Hero() {
  const highlights = [
    "Instant Telegram Admin Alert",
    "100% Confidential & Secure",
    "Fast 2-Hour Response",
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white">
      {/* Background Subtle Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-50/70 via-blue-50/20 to-transparent pointer-events-none -z-10 rounded-full blur-3xl opacity-70" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <span>Direct Telegram Admin Notifications</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
              Get Expert <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Assignment & Project</span> Help
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Submit your requirements and our team will contact you shortly. Fast, affordable, and tailored for college students worldwide.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-sm text-gray-700 font-medium">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Submit Request</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
              >
                <span>Explore Services</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-2xl font-bold text-gray-900">5,000+</p>
                <p className="text-xs text-gray-500 font-medium">Projects Done</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">99.4%</p>
                <p className="text-xs text-gray-500 font-medium">On-Time Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-xs text-gray-500 font-medium">Admin Support</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Card Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-blue-500/5 space-y-5">
              
              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                <Send className="w-3.5 h-3.5" />
                <span>Instant Telegram Delivery</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Fast Turnaround</h3>
                    <p className="text-xs text-gray-500">Replies within 10-15 mins</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Active
                </span>
              </div>

              {/* Sample Workflow Card */}
              <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium text-blue-600">Step 1: Fill Request</span>
                  <span>1 Min</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  Select requirement, subject, deadline & upload task description.
                </p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-4/5 rounded-full"></div>
                </div>
              </div>

              {/* Security Banner */}
              <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-800">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Your contact info & documents are kept strictly confidential.</span>
              </div>

              {/* Direct Submit CTA Link */}
              <Link
                href="/submit"
                className="block text-center w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
              >
                Start Your Submission Now →
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
