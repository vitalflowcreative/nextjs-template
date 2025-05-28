"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import SubscribeButton from "./SubscribeButton";
import { InfoIcon, CheckIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Plan {
  id: string;
  name: string;
  description: string;
  features: Array<{ text: string; tooltip?: string }>;
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
            <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              Save 20%
            </span>
          </Label>
        </div>
      </RadioGroup>

      <div className="grid w-full grid-cols-1 gap-4 lg:max-w-6xl lg:grid-cols-3 lg:gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col gap-6 border shadow-sm rounded-xl p-6 lg:p-8 ${
              plan.name === "Standard" ? "border-primary border-2" : ""
            }`}
          >
            <div className="flex flex-col gap-8 p-0">
              <div className="flex flex-col gap-6">
                <div className="relative flex flex-col gap-3">
                  {plan.name === "Standard" && (
                    <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 border-transparent bg-primary text-primary-foreground absolute top-1 right-0 w-fit">
                      Most popular
                    </span>
                  )}
                  <h3 className={`text-lg font-semibold ${plan.name === "Standard" ? "text-primary" : ""}`}>
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-end gap-0.5">
                  <span className="text-4xl font-semibold">
                    {formatPrice(
                      billingInterval === "month"
                        ? plan.monthly_price_amount
                        : plan.annual_price_amount
                    )}
                  </span>
                  <span className="text-muted-foreground text-base">
                    /{billingInterval}
                  </span>
                </div>
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
                  className={`w-full ${plan.name === "Standard" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
                />
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium">
                  {plan.name === "Basic" 
                    ? "What's included:" 
                    : `Everything in ${plan.name === "Standard" ? "Basic" : "Standard"}, plus:`}
                </p>
                <div className="flex flex-col gap-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckIcon className="text-primary h-5 w-5" />
                      <span className="text-muted-foreground flex-1 text-sm">
                        {feature.text}
                      </span>
                      {feature.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="focus:outline-none"
                                aria-label={`More information about ${feature.text}`}
                              >
                                <InfoIcon className="text-muted-foreground h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 