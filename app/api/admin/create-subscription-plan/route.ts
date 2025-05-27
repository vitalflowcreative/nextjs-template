import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

const requestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()).min(1),
  monthlyPrice: z.number().min(0),
  annualPrice: z.number().min(0).optional(),
});

export async function POST(request: Request) {
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

    // Validate request body
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    // Create Stripe product
    const product = await stripe.products.create({
      name: validatedData.name,
      description: validatedData.description,
      metadata: {
        features: JSON.stringify(validatedData.features),
      },
    });

    // Create Stripe prices
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(validatedData.monthlyPrice * 100), // Convert to cents
      currency: "usd",
      recurring: {
        interval: "month",
      },
    });

    let annualPrice;
    if (validatedData.annualPrice) {
      annualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(validatedData.annualPrice * 100), // Convert to cents
        currency: "usd",
        recurring: {
          interval: "year",
        },
      });
    }

    // Create subscription plan in Supabase
    const { data: plan, error } = await supabase
      .from("subscription_plans")
      .insert({
        name: validatedData.name,
        description: validatedData.description,
        features: validatedData.features,
        monthly_price_id: monthlyPrice.id,
        annual_price_id: annualPrice?.id,
        monthly_price_amount: validatedData.monthlyPrice,
        annual_price_amount: validatedData.annualPrice,
        stripe_product_id: product.id,
        active: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return new NextResponse(
      "Error creating subscription plan",
      { status: 500 }
    );
  }
} 