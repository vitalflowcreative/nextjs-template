import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ManageSubscriptionPlansPage() {
  const supabase = await createClient();
  const { data: plans, error } = await supabase
    .from("subscription_plans")
    .select("id, name, description, active, monthly_price_amount, annual_price_amount")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="text-red-500">Failed to load plans.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-8">Manage Subscription Plans</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {plans?.map((plan: any) => (
          <Card key={plan.id} className="flex flex-col justify-between h-full">
            <CardContent className="flex flex-col gap-4 p-6 flex-1">
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-muted-foreground text-sm flex-1">{plan.description}</p>
              <div className="text-sm">Monthly: ${plan.monthly_price_amount ?? "-"}</div>
              {plan.annual_price_amount && (
                <div className="text-sm">Annual: ${plan.annual_price_amount}</div>
              )}
              <div className="flex gap-2 mt-4">
                <span className={plan.active ? "text-green-600" : "text-red-600"}>
                  {plan.active ? "Active" : "Inactive"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 