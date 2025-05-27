import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[Checkout] Raw request body:", body);

    const { planId, priceId, userId, billingInterval } = body;
    console.log("[Checkout] Starting checkout session creation", {
      planId,
      priceId,
      userId,
      billingInterval,
    });

    // Validate inputs with detailed error messages
    const missingFields = [];
    if (!planId) missingFields.push("planId");
    if (!userId) missingFields.push("userId");
    if (!billingInterval) missingFields.push("billingInterval");

    if (missingFields.length > 0) {
      console.error("[Checkout] Missing required fields", {
        missingFields,
        receivedData: {
          planId: !!planId,
          priceId: !!priceId,
          userId: !!userId,
          billingInterval: !!billingInterval,
        }
      });
      return NextResponse.json(
        { 
          error: "Missing required fields",
          details: `Missing: ${missingFields.join(", ")}`
        },
        { status: 400 }
      );
    }

    // Get the subscription plan from Supabase to verify the price
    const supabase = await createClient();
    console.log("[Checkout] Fetching subscription plan details", { planId });
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      console.error("[Checkout] Failed to fetch plan", { planError });
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    // Check if this is a free plan
    const isFreePlan = !plan.monthly_price_id && !plan.annual_price_id;
    console.log("[Checkout] Plan details", {
      planName: plan.name,
      isFreePlan,
      monthlyPriceId: plan.monthly_price_id,
      annualPriceId: plan.annual_price_id
    });

    if (isFreePlan) {
      // For free plans, we don't need to create a Stripe checkout session
      // Instead, we'll directly create the subscription in Supabase
      console.log("[Checkout] Processing free plan subscription", { planId, userId });
      
      // Check if user already has a subscription
      const { data: existingSubscription } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (existingSubscription) {
        console.log("[Checkout] User already has an active subscription", { 
          userId,
          existingPlanId: existingSubscription.plan_id
        });
        return NextResponse.json(
          { error: "User already has an active subscription" },
          { status: 400 }
        );
      }

      // Create free subscription
      const { error: subscriptionError } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: userId,
          plan_id: planId,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          cancel_at_period_end: false,
        });

      if (subscriptionError) {
        console.error("[Checkout] Failed to create free subscription", { subscriptionError });
        return NextResponse.json(
          { error: "Failed to create free subscription" },
          { status: 500 }
        );
      }

      console.log("[Checkout] Free subscription created successfully", { 
        userId,
        planId,
        planName: plan.name
      });

      return NextResponse.json({ 
        success: true,
        message: "Free subscription activated successfully"
      });
    }

    // For paid plans, verify that the provided priceId matches the plan
    if (!priceId) {
      console.error("[Checkout] Price ID required for paid plan", { planName: plan.name });
      return NextResponse.json(
        { 
          error: "Price ID required for paid plan",
          details: "This plan requires a price ID for checkout"
        },
        { status: 400 }
      );
    }

    const expectedPriceId =
      billingInterval === "month" ? plan.monthly_price_id : plan.annual_price_id;
    
    console.log("[Checkout] Price verification", {
      providedPriceId: priceId,
      expectedPriceId,
      billingInterval,
      planName: plan.name
    });

    if (priceId !== expectedPriceId) {
      console.error("[Checkout] Price mismatch", {
        provided: priceId,
        expected: expectedPriceId,
        billingInterval,
        planName: plan.name
      });
      return NextResponse.json(
        { 
          error: "Invalid price selected",
          details: `Expected price ID ${expectedPriceId} for ${billingInterval}ly billing`
        },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    console.log("[Checkout] Checking for existing Stripe customer", { userId });
    const { data: profile } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    let customerId = profile?.stripe_customer_id;
    console.log("[Checkout] Customer lookup result", { 
      hasExistingCustomer: !!customerId,
      customerId 
    });

    if (!customerId) {
      // Get user email from auth.users
      console.log("[Checkout] No existing customer, fetching user email", { userId });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        console.error("[Checkout] User email not found", { userId });
        return NextResponse.json(
          { error: "User email not found" },
          { status: 400 }
        );
      }

      // Create new Stripe customer
      console.log("[Checkout] Creating new Stripe customer", { email: user.email });
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;
      console.log("[Checkout] New customer created", { customerId });

      // Store Stripe customer ID in Supabase
      console.log("[Checkout] Storing customer ID in Supabase", { userId, customerId });
      await supabase.from("user_subscriptions").insert({
        user_id: userId,
        stripe_customer_id: customerId,
      });
    }

    // Create Stripe checkout session
    console.log("[Checkout] Creating checkout session", { 
      customerId,
      priceId,
      planId,
      planName: plan.name,
      billingInterval
    });
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: userId,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
    });

    console.log("[Checkout] Session created successfully", { 
      sessionId: session.id,
      customerId,
      planId,
      planName: plan.name,
      billingInterval
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("[Checkout] Error creating checkout session:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 