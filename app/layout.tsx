import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
        <main className="flex-1 flex flex-col justify-center items-center w-full">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
