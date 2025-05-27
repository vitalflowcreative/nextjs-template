import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth");
  }

  // Fetch subscription status
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-card rounded-lg p-8 shadow-sm">
        <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
        <p className="text-lg text-muted-foreground mb-4">Signed in as {user.email}</p>
        
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Subscription Status</h2>
          {subscription ? (
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">Current Plan: {subscription.plan_name}</p>
              <p className="text-muted-foreground">
                Status: {subscription.status}
              </p>
              {subscription.current_period_end && (
                <p className="text-muted-foreground">
                  Next billing date: {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md">
              <p className="text-muted-foreground">No active subscription</p>
              <a 
                href="/pricing" 
                className="text-primary hover:text-primary/90 font-medium inline-block mt-2"
              >
                View Plans →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 