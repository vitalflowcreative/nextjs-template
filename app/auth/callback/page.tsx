"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/dashboard";

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }

          // Get the session to ensure it was set
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            throw sessionError;
          }

          if (session) {
            // Session was successfully set
            router.refresh(); // Refresh server components
            router.replace(next); // Redirect to the next page
          } else {
            throw new Error("Session not found");
          }
        } catch (error) {
          router.replace(`/auth?error=${encodeURIComponent(error instanceof Error ? error.message : "Failed to sign in")}`);
        }
      } else {
        router.replace("/auth?error=missing_code");
      }
    };

    getSession();
  }, [searchParams, router, supabase.auth]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg p-8 bg-card">
        <h2 className="text-lg font-semibold">Signing you in...</h2>
        <p className="text-muted-foreground">Please wait while we complete the sign in process.</p>
      </div>
    </div>
  );
} 