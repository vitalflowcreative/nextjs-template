import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const adminActions = [
  {
    title: "Create Subscription Plan",
    description: "Add a new subscription plan to your product.",
    href: "/admin/subscription-plans/new",
  },
  {
    title: "Manage Plans",
    description: "View and edit all current subscription plans.",
    href: "/admin/subscription-plans/manage",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="w-full flex-1 flex flex-col py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-8 border-b pb-6 text-left">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        </div>

        <section className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {adminActions.map((action) => (
              <Card
                key={action.title}
                className="flex flex-col gap-6 border shadow-sm rounded-xl p-2"
              >
                <CardContent className="flex flex-col gap-4 p-6 flex-1">
                  <CardTitle className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm flex-1 mb-4">
                    {action.description}
                  </p>
                  <Button asChild className="mt-auto w-full font-semibold">
                    <Link href={action.href}>{action.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
