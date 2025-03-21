"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Clock, BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getSubscriptionPlans } from "../actions/subscriptionPlansActions";

interface SubscriptionPlan {
  subscriptionType: string;
  validity: string;
  amount: string;
  description: string;
}

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const data = await getSubscriptionPlans();
      setPlans(
        data.map((plan: any) => ({
          subscriptionType: plan.subscriptionType || "",
          validity: plan.validity || "",
          amount: plan.amount || "",
          description: plan.description || "",
        }))
      );
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubscribe = async (planType: string) => {
    if (!session) {
      toast.error('Please log in to subscribe');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionType: planType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      toast.success(`Successfully subscribed to ${planType} plan!`);
      router.push('/quizzes');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe');
    }
  };

  // Mock data for when plans are loading or if fetch fails
  // const mockPlans = [
  //   {
  //     subscriptionType: "Basic",
  //     validity: "30",
  //     amount: "€99",
  //     description: "Essential materials for your MSRA preparation",
  //   },
  //   {
  //     subscriptionType: "Premium",
  //     validity: "90",
  //     amount: "€199",
  //     description:
  //       "Complete resources with practice exams and personalized feedback",
  //   },
  //   {
  //     subscriptionType: "Elite",
  //     validity: "365",
  //     amount: "€299",
  //     description: "Comprehensive package with one-on-one coaching sessions",
  //   },
  // ];

  const displayPlans = plans.length > 0 ? plans : isLoading ? [] : [];

  // Features for each plan
  const planFeatures = {
    Basic: ["Core study materials", "Practice questions", "Basic analytics"],
    Premium: [
      "Everything in Basic",
      "Full practice exams",
      "Detailed performance tracking",
      "Community access",
    ],
    Elite: [
      "Everything in Premium",
      "One-on-one coaching",
      "Priority support",
      "Custom study plans",
    ],
  };

  // FAQ items
  const faqItems = [
    {
      question: "How long do I have access to the materials?",
      answer:
        "Access duration depends on your subscription plan, from 30 days to a full year.",
    },
    {
      question: "Can I upgrade my plan later?",
      answer:
        "Yes, you can upgrade to a higher tier plan at any time by paying the difference in price.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 7-day money-back guarantee if you're not satisfied with your purchase.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
            Simple, Transparent Pricing
          </h1>
          <div className="mt-6 flex justify-center">
            <div className="w-20 h-1 bg-black rounded"></div>
          </div>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your MSRA preparation needs. All
            plans include access to our comprehensive study materials.
          </p>
        </div>

        {/* Pricing Cards */}
        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayPlans.map((tier, index) => (
              <Card
                key={tier.subscriptionType}

                className={`flex flex-col p-8 rounded-xl transform transition-all duration-300 hover:shadow-xl hover:scale-101 ${
                  index === 0
                    ? "bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200 shadow-lg" // Gradient for "Most Popular"
                    : "bg-gradient-to-b from-white to-gray-100 border-2 border-blue-100 shadow-lg"
                }`}

              >
                {index === 0 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" /> Most Popular
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-4 ">
                    <h2 className="text-3xl font-bold text-blue-800">
                      {tier.subscriptionType}
                    </h2>
                    {index === 0 && <Sparkles className="w-6 h-6 text-blue-500" />}
                    {index === 1 && <BookOpen className="w-6 h-6 text-blue-500" />}
                    {index === 2 && <Clock className="w-6 h-6 text-blue-500" />}
                  </div>
                  <div className="mb-4 border-b border-gray-300 pb-2">
                    <p className="text-gray-600 text-lg">
                      {tier.description}
                    </p>
                  </div>
                  <div className="text-black margin-bottom mb-4">
                    <p className="text-lg font-medium">
                      {tier.validity} days access
                    </p>
                  </div>
                  <div className="mt-4 pb-6 border-b border-gray-200 flex items-end">
                    <span className="text-5xl font-bold text-black">
                      {tier.amount}
                    </span>
                    <span className="text-gray-500 ml-2 mb-2">/one-time</span>
                  </div>
                  
                  {/* <div className="mt-4">
                    <h3 className="font-medium text-black mb-2">Features:</h3>
                    <ul className="space-y-2">
                      {index === 0 && planFeatures.Basic.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-black flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                      {index === 1 && planFeatures.Premium.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-black flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                      {index === 2 && planFeatures.Elite.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-black flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div> */}
                </div>
                <Button
                  className={`w-full ${
                    index === 0
                      ? "bg-blue-100 text-black border-2 border-blue-500 hover:bg-blue-200 transition-all duration-300 transform hover:scale-103"
                      : "bg-blue-50 text-black border-2 border-blue-500 hover:bg-blue-100 transition-all duration-300 transform hover:scale-102"
                  }`}
                  size="lg"
                  onClick={() => handleSubscribe(tier.subscriptionType)}
                >
                  {session ? "Subscribe Now" : "Login to Subscribe"}
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Testimonials */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-black">What Our Users Say</h2>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1 bg-black rounded"></div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "The materials were comprehensive and helped me score in the top percentile on my MSRA exam.",
                author: "Dr. Sarah Johnson",
                position: "GP Trainee",
              },
              {
                quote:
                  "Worth every penny. The practice questions were very similar to the actual exam questions.",
                author: "Dr. Michael Chen",
                position: "Surgical Trainee",
              },
              {
                quote:
                  "The analytics helped me identify my weak areas so I could focus my study time effectively.",
                author: "Dr. Emily Williams",
                position: "Psychiatry Trainee",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 border border-blue-100 rounded-xl bg-white shadow-2xl"
              >
                <p className="text-blue-800 italic">"{testimonial.quote}"</p>
                <p className="mt-4 font-medium text-black">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-600">{testimonial.position}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-black">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1 bg-black rounded"></div>
          </div>
          <div className="mt-12 max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="mb-6 border-2 border-blue-100 rounded-2xl p-6 text-left bg-white"
              >
                <h3 className="text-xl font-medium text-blue-800">
                  {item.question}
                </h3>
                <p className="mt-2 text-black">{item.answer}</p>
              </div>
            ))}
          </div>
          {/* <p className="mt-12 text-lg text-gray-600">
            Have more questions?{" "}
            <Link
              href="/contact"
              className="text-black font-medium hover:underline"
            >
              Contact our support team
            </Link>
          </p> */}
        </div>

        {/* CTA */}
        <div className="mt-24 bg-blue-800 text-white p-12 rounded-2xl text-center transition-all duration-400 transform hover:scale-101">
          <h2 className="text-2xl font-bold">
            Ready to ace your MSRA exam?
          </h2>
          <p className="mt-4 text-gray-100 max-w-2xl mx-auto">
            Join thousands of doctors who have successfully used our platform to
            prepare for and excel in their MSRA examinations.
          </p>
          <Button
            className="mt-8 bg-blue-50 text-black hover:bg-blue-100 px-8 py-6 transition-all duration-300 transform hover:scale-103"
            size="lg"
            asChild
          >
            <Link href="/subscribe">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}