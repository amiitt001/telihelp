"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Code2,
  Presentation,
  FileCheck,
  BookOpen,
  Bug,
  ArrowUpRight,
} from "lucide-react";

export default function ServiceCards() {
  const services = [
    {
      id: "assignment",
      title: "Assignment Help",
      typeParam: "Assignment Help",
      description:
        "Comprehensive academic assignment assistance for all engineering, management, and science disciplines.",
      icon: BookOpen,
      badge: "Popular",
    },
    {
      id: "project",
      title: "Project Development",
      typeParam: "Project Help",
      description:
        "Full-stack web, mobile app, machine learning, and hardware prototype project implementation with source code.",
      icon: Code2,
      badge: "Top Choice",
    },
    {
      id: "ppt",
      title: "PPT Creation",
      typeParam: "PPT",
      description:
        "Visually striking, professional presentation decks customized for project reviews, seminars, and defenses.",
      icon: Presentation,
    },
    {
      id: "report",
      title: "Report Writing",
      typeParam: "Report",
      description:
        "IEEE, APA, and university-standard final semester report writing with structured chapters and citations.",
      icon: FileText,
    },
    {
      id: "documentation",
      title: "Documentation",
      typeParam: "Report",
      description:
        "Detailed software architecture documentation, SRS documents, flowcharts, UML diagrams, and API docs.",
      icon: FileCheck,
    },
    {
      id: "debugging",
      title: "Code Debugging",
      typeParam: "Coding Help",
      description:
        "Fix bugs, resolve syntax/runtime errors, optimize performance, and refactor existing codebase rapidly.",
      icon: Bug,
      badge: "Fast Track",
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase font-bold tracking-widest text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
            Our Core Offerings
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Tailored Academic & Technical Support Services
          </h3>
          <p className="text-base text-gray-600">
            Select your service requirement below and get instant expert guidance.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <div className="group relative bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {service.badge && (
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-gray-100">
                    <Link
                      href={`/submit?type=${encodeURIComponent(service.typeParam)}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-700"
                    >
                      <span>Request {service.title}</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
