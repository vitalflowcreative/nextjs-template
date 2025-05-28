import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const requestSchema = z.object({
  planId: z.string().min(1),
});

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if (profile?.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Get plan ID from URL
    const url = new URL(request.url);
    const planId = url.searchParams.get("planId");
    if (!planId) {
      return new NextResponse("Plan ID is required", { status: 400 });
    }

    // Validate plan ID
    requestSchema.parse({ planId });

    // Get the plan from Supabase first to get Stripe product ID
    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("stripe_product_id")
      .eq("id", planId)
      .single();

    if (!plan) {
      return new NextResponse("Plan not found", { status: 404 });
    }

    // Archive the product in Stripe
    await stripe.products.update(plan.stripe_product_id, {
      active: false,
    });

    // Delete the plan from Supabase
    const { error } = await supabase
      .from("subscription_plans")
      .delete()
      .eq("id", planId);

    if (error) {
      throw error;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    return new NextResponse(
      "Error deleting subscription plan",
      { status: 500 }
    );
  }
} 