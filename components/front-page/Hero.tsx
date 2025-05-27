import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="text-center space-y-8 max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold tracking-tight">
        Modern <span className="text-primary">SaaS Template</span> for Next.js
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Launch your SaaS project faster with our production-ready template. Featuring Next.js 14, Supabase Auth, Stripe Subscriptions, and a beautiful UI with Shadcn.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Button asChild size="lg">
          <Link href="/auth">Get Started</Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="bg-black text-white hover:bg-neutral-800 flex items-center gap-2"
        >
          <a
            href="https://github.com/vitalflowcreative/DoodleLabAi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z"
                clipRule="evenodd"
              />
            </svg>
            View on GitHub
          </a>
        </Button>
      </div>
    </section>
  );
} 