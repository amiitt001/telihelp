"use client";

import { motion } from "framer-motion";
import { Zap, DollarSign, Users, ShieldCheck, CheckCircle } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Fast Response",
      description:
        "Instant Telegram alert ensures our team receives your request in seconds and responds within 10-15 minutes.",
      icon: Zap,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Affordable Pricing",
      description:
        "Student-friendly, budget-conscious rates with zero hidden charges. Pay only for the exact scope delivered.",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Experienced Team",
      description:
        "Handled by senior software engineers, academic domain experts, and seasoned technical technical writers.",
      icon: Users,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Secure & Confidential",
      description:
        "Strict non-disclosure policy. Your project documents, contact info, and identity remain 100% private.",
      icon: ShieldCheck,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs uppercase font-bold tracking-widest text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
              Why Choose Us
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Designed For Students Who Demand Speed & Excellence
            </h3>
            <p className="text-base text-gray-600 leading-relaxed">
              We eliminate complex dashboards, logins, and long waiting queues. Just submit your requirements, and our admin team receives an instant notification via Telegram.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                "Direct admin contact without chatbot hurdles",
                "Support for last-minute tight deadlines",
                "Comprehensive code walkthroughs & explanation support",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Feature Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${feature.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
