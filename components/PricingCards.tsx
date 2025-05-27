"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import SubscribeButton from "./SubscribeButton";

interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  monthly_price_id: string;
  annual_price_id: string;
  monthly_price_amount: number;
  annual_price_amount: number;
}

interface PricingCardsProps {
  plans: Plan[];
  userId?: string;
  currentPlan: string | null;
}

export default function PricingCards({ plans, userId, currentPlan }: PricingCardsProps) {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <RadioGroup
        defaultValue={billingInterval}
        onValueChange={(value) => setBillingInterval(value as "month" | "year")}
        className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-1"
      >
        <div>
          <RadioGroupItem
            value="month"
            id="month"
            className="peer sr-only"
          />
          <Label
            htmlFor="month"
            className="flex cursor-pointer select-none items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-background hover:text-foreground peer-data-[state=checked]:bg-background peer-data-[state=checked]:text-foreground"
          >
            Monthly billing
          </Label>
        </div>

        <div>
          <RadioGroupItem
            value="year"
            id="year"
            className="peer sr-only"
          />
          <Label
            htmlFor="year"
            className="flex cursor-pointer select-none items-center justify-center rounded-md px-3 py-2 text-sm font-medium hover:bg-background hover:text-foreground peer-data-[state=checked]:bg-background peer-data-[state=checked]:text-foreground"
          >
            Annual billing
            <span className="ml-1.5 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              Save 20%
            </span>
          </Label>
        </div>
      </RadioGroup>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`w-[300px] ${
              plan.name === "Pro" ? "border-primary" : ""
            }`}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-3xl font-bold">
                {formatPrice(
                  billingInterval === "month"
                    ? plan.monthly_price_amount
                    : plan.annual_price_amount
                )}
                <span className="text-sm font-normal text-muted-foreground">
                  /{billingInterval}
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {plan.description}
              </p>
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <SubscribeButton
                planId={plan.id}
                userId={userId}
                isCurrentPlan={currentPlan === plan.id}
                priceId={
                  billingInterval === "month"
                    ? plan.monthly_price_id
                    : plan.annual_price_id
                }
                billingInterval={billingInterval}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 