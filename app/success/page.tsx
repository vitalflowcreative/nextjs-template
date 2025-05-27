import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  const { session_id } = searchParams;

  // If no session ID, redirect to dashboard
  if (!session_id) {
    redirect("/dashboard");
  }

  // Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-lg">
        <div className="flex justify-center">
          <svg
            className="h-16 w-16 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold">Thank you for subscribing!</h1>
        <p className="text-xl text-muted-foreground">
          Your subscription has been confirmed. You can now access all the features
          included in your plan.
        </p>
        <a
          href="/dashboard"
          className="inline-block mt-8 text-primary hover:text-primary/90"
        >
          Continue to dashboard →
        </a>
      </div>
    </div>
  );
} 