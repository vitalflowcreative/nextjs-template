import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SubscriptionPlanForm } from "./subscription-plan-form";

export default async function NewSubscriptionPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Create New Subscription Plan</h1>
      <SubscriptionPlanForm />
    </div>
  );
} 