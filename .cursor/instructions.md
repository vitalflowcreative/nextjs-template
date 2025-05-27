Okay, I've completely revised the `instructions.md` file to reflect the change from an e-commerce-like product list to a **SaaS-style pricing section with Free, Basic, and Premium tiers, including monthly and annual pricing.**

This update also simplifies the Stripe integration to focus on subscriptions and introduces a new table for tracking user subscriptions. I've removed the "shopping cart" concept and the Zustand instructions for it, as it's no longer relevant to a SaaS subscription model for a "bare-bones" template. If you later need more complex client-side state, you can re-introduce Zustand for those specific needs.

---

**`instructions.md`**

```markdown
# Next.js Auth Template with Supabase (SaaS Pricing & Auth) and Stripe (Subscriptions) Frontend Build

This document outlines the steps for Cursor AI to build the frontend of a Next.js application, integrating Supabase for authentication and user profiles, and Stripe for subscription management.

**Goal:** Create a functional, bare-bones SaaS application with:
1.  Authentication (Sign In, Sign Up, Sign Out) using **React Hook Form** and **Zod**.
2.  User profile management.
3.  A **Pricing Section** displaying Free, Basic, and Premium tiers with monthly/annual options.
4.  Buttons to subscribe to a tier, initiating a Stripe Subscription Checkout.
5.  A server-side webhook endpoint to handle Stripe events and update user subscriptions.

**Assumptions:**
* A Next.js project is already initialized.
* All necessary npm packages (`@supabase/supabase-js`, `@supabase/ssr`, `stripe`, `@stripe/react-stripe-js`, `@stripe/stripe-js`, `react-hook-form`, `zod`, `@hookform/resolvers`, `shadcn-ui` dependencies) are installed.
* `.env.local` variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`) are configured.
* Supabase client utilities (`utils/supabase/client.ts`, `utils/supabase/server.ts`, `utils/supabase/middleware.ts`) are correctly set up.
* **Supabase tables (`profiles`, `subscription_plans`, `user_subscriptions`) with RLS policies are created as per revised instructions.**
* Next.js App Router (`app/`) is being used.

---

## **Phase 1: Core Setup & Shared Components**

### **Step 1: Configure `tailwind.config.js` and `globals.css` for Shadcn UI**
   - **File:** `tailwind.config.js`
   - **Action:** Ensure it's correctly configured for Shadcn UI. This usually involves adding `darkMode: ["class"]`, `content` paths, and the `theme` extensions.
   - **File:** `app/globals.css`
   - **Action:** Ensure it imports the Shadcn UI base styles and any custom CSS.

### **Step 2: Add Essential Shadcn UI Components**
   - **Commands:**
     ```bash
     npx shadcn-ui@latest add button input label card toast form radio-group
     ```
   - **Action:** Confirm these components (and their dependencies like `toaster.tsx`, `use-toast.ts`, `utils.ts` for `toast`; and `form.tsx` for the form components) are added to `components/ui/`.
   - **File:** `app/layout.tsx`
   - **Action:** Import and render the `<Toaster />` component just before the closing `</body>` tag to enable global toast notifications.

---

## **Phase 2: Authentication & User Management**

### **Step 3: Create the `AuthForm` Component (Client Component)**
   - **File:** `components/AuthForm.tsx`
   - **Action:**
     - This will be a client component (`'use client'`).
     - Import `createClient` from `@/utils/supabase/client`.
     - **Implement form using React Hook Form and Zod:**
       - Define a **Zod schema** for email and password validation (e.g., `z.string().email()`, `z.string().min(6)`).
       - Use `useForm` from `react-hook-form` with `zodResolver` to initialize the form.
       - Use Shadcn UI's `<Form {...form}>` to wrap the form.
       - Utilize `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` for input fields.
       - Implement `signInWithPassword` and `signUp` using `supabase.auth` methods in `form.handleSubmit` callback.
       - For `signUp`, include `options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` }`.
       - On successful sign-in/sign-up, use `useToast` to display appropriate messages.
       - Implement basic error handling displaying Zod validation errors via `FormMessage` and Supabase errors via `useToast`.

### **Step 4: Create Auth Callback Route (Server Route Handler)**
   - **File:** `app/auth/callback/route.ts`
   - **Action:**
     - This is a server route handler.
     - Import `createClient` from `@/utils/supabase/server`.
     - Handle the `GET` request from Supabase email confirmation/magic links.
     - Use `supabase.auth.verifyOtp` to complete the authentication flow.
     - Redirect the user to `/dashboard` or `/` upon successful verification, or to an error page.

### **Step 5: Create Dashboard Page (Server Component)**
   - **File:** `app/dashboard/page.tsx`
   - **Action:**
     - This will be a Server Component.
     - Import `createClient` from `@/utils/supabase/server`.
     - Fetch the current authenticated user using `supabase.auth.getUser()`.
     - If no user is found, redirect to the home page or `/auth`.
     - Display a welcome message including the user's email.
     - **Fetch and display the user's current subscription status** from the `user_subscriptions` table using `supabase.from('user_subscriptions').select('*').eq('user_id', user.id).single()`. Display plan name, status, and renewal date if available.
     - Add a "Sign Out" button (this will be a separate Client Component).

### **Step 6: Create Sign Out Button Component (Client Component)**
   - **File:** `components/SignOutButton.tsx`
   - **Action:**
     - This will be a client component (`'use client'`).
     - Import `createClient` from `@/utils/supabase/client`.
     - Implement a `signOut` function using `supabase.auth.signOut()`.
     - On sign out, redirect the user to `/` or `/auth`.
     - Use Shadcn UI `Button` for the sign-out action.

### **Step 7: Implement Navbar/Header (Client Component for interactive parts)**
   - **File:** `components/Navbar.tsx`
   - **Action:**
     - This component will be a Client Component (`'use client'`).
     - Import `createClient` from `@/utils/supabase/client` and `useEffect`, `useState`.
     - Use `supabase.auth.onAuthStateChange` to listen for auth events and update UI (e.g., if a user is logged in).
     - Conditionally render a "Sign In" link (e.g., to `/auth`) or the `SignOutButton` component.
     - Include navigation links (e.g., "Home", "Pricing", "Dashboard").
   - **File:** `app/layout.tsx`
   - **Action:** Include the `<Navbar />` component.

### **Step 8: Create `app/auth/page.tsx`**
   - **File:** `app/auth/page.tsx`
   - **Action:**
     - This page will render the `AuthForm` component.
     - It should be a client component.
     - Add basic styling to center the form.

---

## **Phase 3: Pricing Section & Stripe Subscription Integration**

### **Step 9: Create the Pricing Page (Server Component)**
   - **File:** `app/pricing/page.tsx`
   - **Action:**
     - This will be a Server Component.
     - Import `createClient` from `@/utils/supabase/server`.
     - Fetch all `active` subscription plans from the `public.subscription_plans` table, ordered by `monthly_price_amount` (or some logical order).
     - Display each plan using Shadcn UI `Card` components, showing:
       - `name` (e.g., "Free", "Basic", "Premium")
       - `description`
       - `features` (if stored as an array/JSONB, iterate and list them)
       - **Pricing options:** Display both `monthly_price_amount` and `annual_price_amount`.
       - Implement a `RadioGroup` (Shadcn UI) to allow users to select "Monthly" or "Annual" billing.
       - Include a "Choose Plan" or "Subscribe" button for each plan (this will be a separate Client Component, `SubscribeButton`).
     - **Important:** Ensure the current user's subscription status is also checked to conditionally display "Current Plan" or "Upgrade" instead of "Subscribe". Fetch `auth.uid()` and query `user_subscriptions` here.

### **Step 10: Create `SubscribeButton` Component (Client Component)**
   - **File:** `components/SubscribeButton.tsx`
   - **Action:**
     - This will be a client component (`'use client'`).
     - Props: `planId` (string), `billingInterval` (string: 'month' or 'year').
     - Import `loadStripe` from `@stripe/stripe-js` and `useToast` from Shadcn UI.
     - Import `createClient` from `@/utils/supabase/client` to get the current user's ID for the API call.
     - On button click:
       1.  Get the current `user.id` from Supabase client.
       2.  Make an API call to a **new server-side Next.js API route** (`/api/create-subscription-checkout-session`) to create a Stripe Checkout Session.
           - Pass `planId`, `billingInterval`, and `userId` to this API route.
       3.  Receive the `sessionId` from the API route.
       4.  Load Stripe using `loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)`.
       5.  Redirect to Stripe Checkout: `stripe.redirectToCheckout({ sessionId: sessionId })`.
       6.  Handle potential errors with `useToast`.

### **Step 11: Create Server-Side API Route for Stripe Subscription Checkout Session**
   - **File:** `app/api/create-subscription-checkout-session/route.ts`
   - **Action:**
     - This is a server route handler.
     - Import `Stripe` from `stripe` (using `process.env.STRIPE_SECRET_KEY!`).
     - Import `createClient` from `@/utils/supabase/server`.
     - Handle `POST` requests.
     - Extract `planId`, `billingInterval`, and `userId` from the request body.
     - **Crucially:**
       - Fetch the `stripe_price_id` (either `monthly_price_id` or `annual_price_id` based on `billingInterval`) from your `public.subscription_plans` table using Supabase to prevent client-side manipulation.
       - Check if the `userId` already has an active Stripe customer ID in `public.user_subscriptions`. If not, create a new Stripe customer.
     - Create a `stripe.checkout.sessions.create` call.
       - Use `mode: 'subscription'`.
       - Use `line_items` with the fetched `price_id`.
       - Set `success_url` (e.g., `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`) and `cancel_url` (e.g., `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`).
       - Pass `customer` (Stripe Customer ID) and `client_reference_id` (your `userId`) for linking the subscription.
       - Pass `metadata` for `plan_id` and `billing_interval` for later use in webhooks.
     - Return the `sessionId` to the client.

### **Step 12: Create Stripe Webhook Handler (Server Route Handler)**
   - **File:** `app/api/stripe-webhook/route.ts`
   - **Action:**
     - This is a server route handler.
     - Import `Stripe` from `stripe` and `createClient` from `@/utils/supabase/server`.
     - Handle `POST` requests.
     - **Verify the Stripe webhook signature:** This is critical for security. Use `stripe.webhooks.constructEvent` with `req.headers.get('stripe-signature')` and `process.env.STRIPE_WEBHOOK_SECRET!`.
     - Handle relevant Stripe events (e.g., `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`).
       - For `checkout.session.completed`:
         - Retrieve `client_reference_id` (your `userId`) and `metadata` (`plan_id`, `billing_interval`).
         - Extract `customer_id` and `subscription_id` from the Stripe event object.
         - **Insert/Update** an entry in your `public.user_subscriptions` table with this information. Set status to `active`, and record `current_period_start`, `current_period_end`.
       - For `customer.subscription.updated`:
         - Update relevant fields in `public.user_subscriptions` (e.g., `status`, `current_period_end`, `cancel_at_period_end`).
       - For `customer.subscription.deleted`:
         - Update `status` to `'canceled'` or `'inactive'` in `public.user_subscriptions`.
     - Return a `200 OK` response to Stripe.

### **Step 13: (Optional) Success/Error Pages (for Redirects)**
   - **File:** `app/success/page.tsx` (or dashboard)
   - **Action:** A simple page that displays a success message, or redirects to `/dashboard` after a successful checkout.
   - **File:** `app/cancel/page.tsx` (or pricing)
   - **Action:** A simple page that displays a cancellation message, or redirects back to `/pricing`.

---

## **Phase 4: Root Page & Navigation**

### **Step 14: Update `app/page.tsx` (Home Page)**
   - **File:** `app/page.tsx`
   - **Action:**
     - This will be a Server Component.
     - Display a welcoming message.
     - Include links to "Sign In/Up" (if not logged in) or "Dashboard" and "Pricing".

### **Step 15: Final review of `app/layout.tsx`**
   - **File:** `app/layout.tsx`
   - **Action:**
     - Ensure it includes `<html>`, `<body>`, and any global providers if you add them later.
     - Make sure `<Toaster />` is present.
     - The `Navbar` component should be rendered.

---

## **Testing and Verification Steps for Cursor AI:**

1.  **Run `npm run dev`** to start the development server.
2.  **Verify Auth Flow:**
    * Navigate to `/auth`.
    * Attempt to sign up a new user. Verify email confirmation (check your Supabase project's auth logs for the link if you're not using a real email service yet).
    * Attempt to sign in with an existing user.
    * Verify the user is redirected to `/dashboard` upon successful login.
    * Test the "Sign Out" button.
3.  **Verify Profile Table:** After a new user signs up, check your Supabase Dashboard's `profiles` table to ensure a new entry was created with the correct `id`.
4.  **Populate Subscription Plans:** Manually add a few example plans (Free, Basic, Premium) to your `public.subscription_plans` table in the Supabase Dashboard.
    * **Crucially, create corresponding Products and Prices in your Stripe Dashboard** (e.g., "Basic Plan - Monthly" with a monthly recurring price, and "Basic Plan - Annual" with an annual recurring price). Link these Stripe Price IDs to your `subscription_plans` table entries.
    * Ensure `active` is `true` for all plans you want to display.
5.  **Verify Pricing Display:** Navigate to `/pricing`. Ensure all active plans are displayed correctly with their monthly/annual options.
6.  **Verify Stripe Subscription Checkout:**
    * Click a "Choose Plan" button for a paid tier.
    * Ensure it redirects to a Stripe Checkout page.
    * Complete a test payment using Stripe's test card numbers.
    * Verify the redirect to `/dashboard` (or success page).
7.  **Verify Webhook Handling:**
    * **Crucial:** In development, run `stripe listen --forward-to localhost:3000/api/stripe-webhook` to forward Stripe webhook events to your local API.
    * After a successful test payment, observe the Stripe CLI output to ensure the `checkout.session.completed` event is received.
    * Check your Supabase Dashboard's `user_subscriptions` table to ensure a new entry was created and its `status` is `active`.
8.  **Verify Dashboard Subscription Status:** Navigate to `/dashboard` and confirm the user's current subscription plan and status are displayed correctly.
9.  **Check Console for Errors:** Monitor the browser console and server terminal for any errors.
```