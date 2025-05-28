"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SubscribeButtonProps {
  planId: string;
  priceId: string;
  userId?: string;
  isCurrentPlan: boolean;
  billingInterval: "month" | "year";
  className?: string;
}

export default function SubscribeButton({
  planId,
  priceId,
  userId,
  isCurrentPlan,
  billingInterval,
  className,
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!userId) {
      toast.error("Please sign in to subscribe");
      router.push("/auth");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/create-subscription-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          priceId,
          userId,
          billingInterval,
        }),
      });

      const { sessionId, error } = await response.json();
      if (error) throw new Error(error);

      // Load Stripe and redirect to checkout
      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) throw new Error("Stripe failed to load");

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) throw stripeError;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCurrentPlan) {
    return (
      <Button className={cn("w-full", className)} disabled>
        Current plan
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={cn("w-full", className)}
    >
      {isLoading ? "Loading..." : "Subscribe"}
    </Button>
  );
} 