import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth");
  }

  // Fetch all subscriptions for the user
  const { data: subscriptions, error: subError } = await supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("current_period_end", { ascending: false });

  return (
    <div className="w-full flex-1 flex flex-col bg-muted/40 py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8 border-b pb-6 text-left">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome, <span className="font-semibold">{user.email}</span></p>
        </div>

        <section className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">Your Subscriptions</h2>
          {subError ? (
            <div className="text-destructive">Failed to load subscriptions.</div>
          ) : subscriptions && subscriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subscriptions.map((sub) => (
                <Card key={sub.id || sub.plan_id} className="border shadow-sm">
                  <CardContent className="flex flex-col gap-2 p-6">
                    <CardTitle className="mb-1">{sub.plan_name || "Unknown Plan"}</CardTitle>
                    <CardDescription className="mb-2">
                      Status: <span className="font-medium">{sub.status}</span>
                    </CardDescription>
                    <div className="text-sm text-muted-foreground">
                      {sub.current_period_start && (
                        <div>
                          <span className="font-medium">Start:</span> {new Date(sub.current_period_start).toLocaleDateString()}
                        </div>
                      )}
                      {sub.current_period_end && (
                        <div>
                          <span className="font-medium">End:</span> {new Date(sub.current_period_end).toLocaleDateString()}
                        </div>
                      )}
                      {sub.cancel_at_period_end && (
                        <div className="text-warning">Will cancel at period end</div>
                      )}
                    </div>
                    {sub.status === "active" && (
                      <Button asChild className="mt-4 w-fit">
                        <a href="https://billing.stripe.com" target="_blank" rel="noopener noreferrer">
                          Manage in Stripe
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-md text-center">
              <p className="text-muted-foreground mb-2">You have no active subscriptions.</p>
              <Button asChild>
                <a href="/pricing">View Plans →</a>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
} 