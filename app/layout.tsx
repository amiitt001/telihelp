import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Assignment & Project Help | Fast Expert Academic Assistance",
  description:
    "Submit your assignment, coding project, report writing, or PPT requirements and receive instant expert assistance. Real-time Telegram notification for fast response.",
  keywords: [
    "Assignment Help",
    "Project Development",
    "Coding Help",
    "PPT Creation",
    "Report Writing",
    "College Homework Help",
    "Code Debugging",
  ],
  authors: [{ name: "Assignment & Project Help Desk" }],
  openGraph: {
    title: "Assignment & Project Help | Fast Expert Academic Assistance",
    description:
      "Submit your requirements and our expert team will contact you shortly. Fast, affordable, and 100% confidential.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
