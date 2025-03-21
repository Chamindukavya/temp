'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Subscription Required
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You need an active subscription to access our quizzes and practice papers.
          </p>
        </div>
        <div className="mt-8">
          <Button
            onClick={() => router.push('/pricing')}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            View Subscription Plans
          </Button>
        </div>
      </div>
    </div>
  );
} 