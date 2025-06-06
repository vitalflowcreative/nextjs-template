import { createClient } from "@/utils/supabase/server";
import PricingCards from "@/components/PricingCards";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch subscription plans from Supabase
  const { data: plans, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("active", true)
    .order("monthly_price_amount");

  if (error) {
    console.error("Error fetching plans:", error);
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-destructive">
          Error loading pricing plans
        </h1>
        <p className="text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  // Get current user's subscription status
  let currentPlan = null;
  if (user) {
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();
    
    currentPlan = subscription?.plan_id;
  }

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center space-y-8 max-w-3xl mx-auto pb-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Simple, <span className="text-primary">transparent</span> pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for you and start creating amazing AI-generated images today
        </p>
      </div>

      <PricingCards 
        plans={plans || []} 
        userId={user?.id} 
        currentPlan={currentPlan}
      />
    </div>
  );
} 