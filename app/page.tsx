import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-3xl px-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Modern{" "}
          <span className="text-primary">SaaS Template</span>
          {" "}for Next.js
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Launch your SaaS project faster with our production-ready template.
          Featuring Next.js 14, Supabase Auth, Stripe Subscriptions, and a beautiful UI with Shadcn.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {user ? (
            <Button asChild size="lg">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/auth">
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Authentication Ready</h3>
            <p className="text-muted-foreground">
              Secure authentication with Supabase Auth, including email/password and magic links.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Stripe Integration</h3>
            <p className="text-muted-foreground">
              Complete subscription system with Stripe, including webhooks and customer portal.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Modern Stack</h3>
            <p className="text-muted-foreground">
              Built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI components.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
