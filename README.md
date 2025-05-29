# Next.js SaaS Boilerplate

---

A modern, production-ready SaaS starter template for Next.js projects. Includes authentication (Supabase), subscription billing (Stripe), beautiful UI (Shadcn UI), and a full subscription management flow. Built for rapid development of SaaS products with best practices and extensibility in mind.

## 🚀 Features

- **Authentication**: Sign up, sign in, sign out with Supabase Auth (email/password, magic links).
- **User Profiles**: Managed in Supabase with RLS for security.
- **Subscription Billing**: Stripe integration for monthly/annual plans, checkout, and webhooks.
- **Pricing Page**: Dynamic pricing cards with plan selection and billing interval toggle.
- **Dashboard**: User dashboard showing current subscription and account info.
- **Admin Tools**: (Optional) Admin pages for managing subscription plans.
- **UI Components**: Shadcn UI (button, input, label, card, toast, form, radio-group, etc.) with Tailwind CSS.
- **TypeScript**: Full type safety throughout.
- **App Router**: Uses Next.js App Router (`app/` directory).

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Supabase](https://supabase.com/) (Auth, Database, RLS)
- [Stripe](https://stripe.com/) (Subscriptions, Checkout, Webhooks)
- [Shadcn UI](https://ui.shadcn.com/) (UI components)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (forms & validation)
- [Tailwind CSS](https://tailwindcss.com/)

## ⚡ Quick Start

1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase and Stripe keys.
4. **Set up Supabase:**
   - Create a new Supabase project.
   - Run the SQL in `utils/supabase/migrations/00001_initial_schema.sql` to set up tables and RLS.
   - Add example subscription plans in the `subscription_plans` table and link to Stripe Price IDs.
5. **Run the dev server:**
   ```bash
   npm run dev
   ```
6. **(Optional) Set up Stripe webhook:**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-webhook
   ```

## 📁 Project Structure

- `app/` — Next.js App Router pages (auth, dashboard, pricing, api, etc.)
- `components/` — UI and logic components (AuthForm, Navbar, PricingCards, SubscribeButton, etc.)
- `components/ui/` — Shadcn UI components
- `utils/supabase/` — Supabase client/server utilities and migrations
- `app/api/` — API routes for Stripe checkout and webhook

## 📝 Setup & Customization

- See `.cursor/instructions.md` for a full breakdown of features, file responsibilities, and extension points.
- Update the `subscription_plans` table and Stripe products/prices to match your business model.
- Customize UI and add your own features/pages as needed.

## 🧩 Included Pages

- `/auth` — Sign in/up
- `/dashboard` — User dashboard
- `/pricing` — Pricing & plan selection
- `/api/create-subscription-checkout-session` — Stripe checkout session API
- `/api/stripe-webhook` — Stripe webhook handler
- `/admin/subscription-plans` — (Optional) Admin plan management

## 🛡️ Security

- Supabase Row Level Security (RLS) is enabled and policies are provided in the migration SQL.
- Stripe webhooks are verified for authenticity.

## 🙌 Credits

- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [Next.js](https://nextjs.org/)

---

**Start building your SaaS faster with this Next.js boilerplate!**
