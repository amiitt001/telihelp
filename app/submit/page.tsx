import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Submit Request | Assignment & Project Help",
  description:
    "Submit your assignment or project details for instant expert support and real-time Telegram delivery.",
};

export default function SubmitPage() {
  return (
    <div className="pt-32 pb-20 bg-gray-50/40 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm font-semibold text-gray-600">
                Loading request form...
              </p>
            </div>
          }
        >
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
