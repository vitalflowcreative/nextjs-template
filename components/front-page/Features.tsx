export default function Features() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto px-4">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Authentication Ready</h3>
        <p className="text-muted-foreground">
          Secure authentication with Supabase Auth, including email/password and magic links.
        </p>
      </div>
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Stripe Integration</h3>
        <p className="text-muted-foreground">
          Complete subscription system with Stripe, including webhooks and customer portal.
        </p>
      </div>
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Modern Stack</h3>
        <p className="text-muted-foreground">
          Built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI components.
        </p>
      </div>
    </section>
  );
} 