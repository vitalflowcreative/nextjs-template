"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import SignOutButton from "./SignOutButton";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          setRole(data?.role || null);
        });
    } else {
      setRole(null);
    }
  }, [user, supabase]);

  return (
    <header>
      <nav className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          <Link href="/" className="font-semibold">
            Next.js SaaS Template
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/pricing"
              className={`text-sm ${
                pathname === "/pricing"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              Pricing
            </Link>
            {role === 'admin' && (
              <Link
                href="/admin"
                className={`text-sm ${
                  pathname === "/admin"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Admin
              </Link>
            )}
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/dashboard"
                      className={`text-sm ${
                        pathname === "/dashboard"
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <SignOutButton />
                  </div>
                ) : (
                  <Button asChild>
                    <Link href="/auth">Sign in</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 