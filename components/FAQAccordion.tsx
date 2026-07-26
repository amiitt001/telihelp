"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does it take to receive a response after submitting?",
      answer:
        "Because every submission triggers an instant Telegram notification directly to our admin's device, our team typically responds via WhatsApp or email within 10 to 15 minutes.",
    },
    {
      question: "Can I upload project guidelines or problem statements?",
      answer:
        "Yes! You can attach documents (PDF, DOCX, ZIP, PNG, JPG up to 10MB) directly in the submission form. The file is uploaded and sent alongside your project details.",
    },
    {
      question: "Is my personal and academic information kept private?",
      answer:
        "Absolutely 100%. We strictly adhere to student confidentiality standards. Your name, email, college, and files are never shared with third parties.",
    },
    {
      question: "What types of technologies and programming languages do you support?",
      answer:
        "Our team covers Python, Java, C++, JavaScript/TypeScript, React, Next.js, Node.js, Django, Flutter, PHP, SQL, Data Science/ML models, MATLAB, and general engineering assignments.",
    },
    {
      question: "Do you offer revisions if requirements change?",
      answer:
        "Yes! We ensure your project strictly complies with your initial guidelines. If any adjustment is needed according to the submitted instructions, we provide fast revisions.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-gray-600">
            Everything you need to know about our instant submission & support workflow.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 text-base hover:text-blue-600 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-blue-50 text-blue-600" : "text-gray-400"
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
