# Admin Dashboard: Subscription Plan Creation (Stripe + Supabase)

## Step 1: Set Up the Admin Dashboard Route

- Create a new route in your Next.js app, e.g. `/app/admin/subscription-plans/new`.
- Restrict access to admin users only (check session/role in the page or middleware).

---

## Step 2: Build the Subscription Plan Form

- Use **React Hook Form** for form state management.
- Use **Zod** for schema validation.
- Use **Shadcn UI** components for the UI.
- Fields to include:
  - Plan Name (string)
  - Description (string, optional)
  - Features (array of strings, e.g. as a dynamic list)
  - Monthly Price (number)
  - Annual Price (number, optional)

---

## Step 3: Create the API Route for Plan Creation

- Create a new API route, e.g. `/app/api/admin/create-subscription-plan/route.ts`.
- This route should:
  1. Validate the request body with Zod.
  2. Use the Stripe Node SDK to:
     - Create a Product.
     - Create one or two Prices (monthly and/or annual).
  3. Insert the new plan into the `subscription_plans` table in Supabase, including the Stripe product and price IDs.
- Restrict this route to admin users only.

---

## Step 4: Connect the Form to the API Route

- On form submit, send a POST request to the API route with the form data.
- Show loading, success, and error states in the UI.

---

## Step 5: Test the Workflow

- Log in as an admin.
- Go to the new admin dashboard page.
- Fill out the form and submit.
- Check that:
  - The product and prices are created in Stripe.
  - The new plan appears in your Supabase `subscription_plans` table with the correct Stripe IDs.

---

## Step 6: (Optional) List and Manage Plans

- On the admin dashboard, list all existing plans from Supabase.
- Allow editing or deactivating plans as needed.

---

## Security & Best Practices

- Never expose your Stripe secret key client-side.
- Use RLS and/or Supabase policies to restrict who can insert/update plans.
- Validate all input on both client and server.
- Consider using Stripe webhooks to keep Supabase in sync if plans are updated directly in Stripe. 