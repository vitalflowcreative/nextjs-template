import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js SaaS Template - Modern Full-Stack Starter",
  description: "Production-ready SaaS starter template with Next.js 14, Supabase Auth, Stripe Subscriptions, and Shadcn UI. Build your next big idea faster.",
  keywords: ["Next.js", "SaaS template", "Supabase", "Stripe", "Authentication", "Subscriptions", "React", "TypeScript"],
  authors: [{ name: "Next.js SaaS Template Team" }],
  openGraph: {
    title: "Next.js SaaS Template - Modern Full-Stack Starter",
    description: "Launch your SaaS faster with Next.js, Supabase Auth, and Stripe Subscriptions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-6 md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Next.js SaaS Template. All rights reserved.
              </p>
            </div>
            <div className="mt-4 flex justify-center space-x-6 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Documentation
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                GitHub
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                License
              </a>
            </div>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
