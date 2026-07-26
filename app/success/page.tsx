import SuccessCard from "@/components/SuccessCard";

export const metadata = {
  title: "Request Submitted | Assignment & Project Help",
  description: "Your request has been submitted successfully to our team.",
};

export default function SuccessPage() {
  return (
    <div className="pt-32 pb-20 bg-gray-50/40 min-h-screen flex items-center justify-center">
      <SuccessCard />
    </div>
  );
}
