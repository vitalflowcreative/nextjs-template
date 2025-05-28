import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ConfirmPopup } from "@/components/admin/ConfirmPopup";

function formatPrice(amount: number | null | undefined) {
  if (typeof amount !== "number") return "-";
  if (amount === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default async function ManageSubscriptionPlansPage() {
  const supabase = await createClient();
  const { data: plans, error } = await supabase
    .from("subscription_plans")
    .select("id, name, description, features, active, monthly_price_amount, annual_price_amount")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-red-500">Failed to load plans.</div>;
  }

  return (
    <div className="w-full flex-1 flex flex-col py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8 border-b pb-6 text-left flex items-center justify-between">
          <h1 className="text-4xl font-bold mb-2">Manage Subscription Plans</h1>
          <Button asChild className="font-semibold">
            <Link href="/admin/subscription-plans/new">Create Plan</Link>
          </Button>
        </div>
        <section className="mt-4">
          <div className="grid w-full grid-cols-1 gap-4 lg:max-w-6xl lg:grid-cols-3 lg:gap-6">
            {plans?.map((plan: any) => (
              <Card
                key={plan.id}
                className={`flex flex-col gap-6 border shadow-sm rounded-xl p-6 lg:p-8`}
              >
                <div className="flex flex-col gap-8 p-0">
                  <div className="flex flex-col gap-6">
                    <div className="relative flex flex-col gap-3">
                      <h3 className={`text-lg font-semibold`}>
                        {plan.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {plan.description}
                      </p>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex items-end gap-0.5">
                        <span className="text-4xl font-semibold">
                          {formatPrice(plan.monthly_price_amount)}
                        </span>
                        <span className="text-muted-foreground text-base">/month</span>
                      </div>
                      {plan.annual_price_amount && (
                        <div className="flex items-end gap-0.5">
                          <span className="text-4xl font-semibold">
                            {formatPrice(plan.annual_price_amount)}
                          </span>
                          <span className="text-muted-foreground text-base">/year</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Features</AccordionTrigger>
                      <AccordionContent>
                      <div className="flex flex-col gap-4">
                          <p className="text-sm font-medium">
                            {plan.name === "Basic"
                              ? "What's included:"
                              : `Everything in ${plan.name === "Standard" ? "Basic" : "Standard"}, plus:`}
                          </p>
                          <div className="flex flex-col gap-4">
                            {Array.isArray(plan.features) && plan.features.length > 0 && plan.features.map((feature: any, i: number) => (
                              <div key={i} className="flex items-center gap-3">
                                <CheckIcon className="text-primary h-5 w-5" />
                                <span className="text-muted-foreground flex-1 text-sm">
                                  {typeof feature === "object" && feature !== null && "text" in feature ? feature.text : String(feature)}
                                </span>
                                {typeof feature === "object" && feature !== null && feature.tooltip && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          className="focus:outline-none"
                                          aria-label={`More information about ${typeof feature === "object" && feature.text ? feature.text : feature}`}
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
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex gap-2 mt-2 items-center">
                    <ConfirmPopup id={plan.id} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 