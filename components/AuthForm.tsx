"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be less than 72 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: AuthFormValues) {
    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account");
      } else {
        const { error } = await supabase.auth.signInWithPassword(data);
        if (error) throw error;
        router.refresh();
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border shadow-sm rounded-xl backdrop-blur">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">
          {isSignUp ? "Create an account" : "Sign in"}
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          {isSignUp
            ? "Sign up to get started with your SaaS journey."
            : "Sign in to your account to access your dashboard."}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="transition focus-visible:ring-2 focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                        className="transition focus-visible:ring-2 focus-visible:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    {isSignUp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Password must be at least 6 characters.
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold transition focus-visible:ring-2 focus-visible:ring-primary"
              >
                {isLoading ? (
                  "Loading..."
                ) : isSignUp ? (
                  "Create account"
                ) : (
                  "Sign in"
                )}
              </Button>
              <div className="flex items-center gap-2 my-2">
                <span className="flex-1 h-px bg-muted-foreground/20" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  or
                </span>
                <span className="flex-1 h-px bg-muted-foreground/20" />
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="w-full flex items-center gap-2 bg-black hover:bg-neutral-900 text-white hover:text-white border-black"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: "github"
                    });
                    if (error) throw error;
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "GitHub sign-in failed");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                aria-label="Sign in with GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.58.688.482C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign in with GitHub
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
                className="w-full text-sm transition hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Add fade-in animation
// In your global CSS (e.g., globals.css), add:
// @keyframes fade-in { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none; } }
// .animate-fade-in { animation: fade-in 0.6s cubic-bezier(.4,0,.2,1) both; } 