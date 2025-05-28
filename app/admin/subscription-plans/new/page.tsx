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
    <div className="w-full flex-1 flex flex-col py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8 border-b pb-6 text-left">
          <h1 className="text-4xl font-bold mb-2">Create New Subscription Plan</h1>
        </div>

        <section className="mt-4">
          <SubscriptionPlanForm />  
        </section>
      </div>
    </div>
  );
} 