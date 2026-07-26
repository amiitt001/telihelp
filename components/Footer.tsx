import Link from "next/link";
import { GraduationCap, Send, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg">
                Assignment<span className="text-blue-500">&</span>Project Help
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Fast, reliable, and confidential assignment & technical project assistance for students. Direct Telegram admin notification for instant response.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <Send className="w-3.5 h-3.5" />
              <span>Real-Time Telegram Admin Dispatch Enabled</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-blue-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className="hover:text-blue-400 transition-colors">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-blue-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-blue-400 transition-colors">
                  Submit Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Assignment Help</li>
              <li>Project Development</li>
              <li>PPT Creation</li>
              <li>Report Writing</li>
              <li>Documentation</li>
              <li>Code Debugging</li>
            </ul>
          </div>

          {/* Trust Guarantee */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">
              Confidentiality
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              All shared requirements, code bases, personal details, and documents are protected under strict privacy policies.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Student Data Encrypted</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Assignment & Project Help Desk. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for students with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
