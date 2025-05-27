import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Use Supabase service role key to bypass RLS
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        
        console.log("[Webhook] checkout.session.completed received", {
          sessionId: session.id,
          subscriptionId,
          clientReferenceId: session.client_reference_id,
          customer: session.customer,
          metadata: session.metadata,
        });
        
        if (!subscriptionId) {
          console.error("[Webhook] No subscription ID in session", { session });
          throw new Error("No subscription ID in session");
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;
        if (!subscription) {
          console.error("[Webhook] Failed to retrieve subscription", { subscriptionId });
          throw new Error("Failed to retrieve subscription");
        }

        // Get the first subscription item for period dates
        const item = subscription.items.data[0];
        const periodStart = new Date(item.current_period_start * 1000);
        const periodEnd = new Date(item.current_period_end * 1000);

        console.log("[Webhook] Stripe subscription details", {
          id: subscription.id,
          status: subscription.status,
          metadata: subscription.metadata,
          current_period_start: item.current_period_start,
          current_period_end: item.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
        });

        // Update or create subscription record
        const { error: upsertError, data: upsertData } = await supabase.from("user_subscriptions").upsert({
          user_id: session.client_reference_id!,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          plan_id: subscription.metadata.planId,
          status: subscription.status,
          current_period_start: periodStart.toISOString(),
          current_period_end: periodEnd.toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        });
        if (upsertError) {
          console.error("[Webhook] Error upserting user_subscriptions", { upsertError });
        } else {
          console.log("[Webhook] user_subscriptions upserted successfully", { upsertData });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // Get the first subscription item for period dates
        const item = subscription.items.data[0];
        const periodStart = new Date(item.current_period_start * 1000);
        const periodEnd = new Date(item.current_period_end * 1000);

        // Update subscription record
        await supabase
          .from("user_subscriptions")
          .update({
            status: subscription.status,
            current_period_start: periodStart.toISOString(),
            current_period_end: periodEnd.toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
} 