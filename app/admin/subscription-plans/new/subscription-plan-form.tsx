"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const subscriptionPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  monthlyPrice: z.number().min(0, "Price must be 0 or greater"),
  annualPrice: z.number().min(0, "Price must be 0 or greater").optional(),
});

type SubscriptionPlanFormValues = z.infer<typeof subscriptionPlanSchema>;

export function SubscriptionPlanForm({ initialData }: { initialData?: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""]);

  const form = useForm<SubscriptionPlanFormValues>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: initialData
      ? {
          name: initialData.name || "",
          description: initialData.description || "",
          features: initialData.features || [""],
          monthlyPrice: initialData.monthly_price_amount || 0,
          annualPrice: initialData.annual_price_amount,
        }
      : {
          name: "",
          description: "",
          features: [""],
          monthlyPrice: 0,
          annualPrice: undefined,
        },
  });

  useEffect(() => {
    if (initialData?.features) {
      setFeatures(initialData.features);
    }
  }, [initialData]);

  async function onSubmit(data: SubscriptionPlanFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/create-subscription-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save subscription plan");
      }

      toast.success("Subscription plan created successfully!");
      form.reset();
      setFeatures([""]);
    } catch (error) {
      console.error("Error saving subscription plan:", error);
      toast.error("Failed to create subscription plan");
    } finally {
      setIsLoading(false);
    }
  }

  const addFeature = () => {
    setFeatures([...features, ""]);
    const currentFeatures = form.getValues("features");
    form.setValue("features", [...currentFeatures, ""]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    form.setValue(
      "features",
      form.getValues("features").filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card rounded-lg p-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter plan name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter plan description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Features</FormLabel>
          {features.map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`features.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Enter feature" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {features.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeFeature(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addFeature}>
            Add Feature
          </Button>
        </div>

        <FormField
          control={form.control}
          name="monthlyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>Price in USD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="annualPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Price (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                />
              </FormControl>
              <FormDescription>Price in USD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Plan"}
        </Button>
      </form>
    </Form>
  );
} 