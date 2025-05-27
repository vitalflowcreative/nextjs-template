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
  {
    title: "View Users",
    description: "See all registered users and their roles.",
    href: "/admin/users",
  },
  {
    title: "View Orders",
    description: "Review all customer orders and statuses.",
    href: "/admin/orders",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {adminActions.map((action) => (
          <Card key={action.title} className="flex flex-col justify-between h-full">
            <CardContent className="flex flex-col gap-4 p-6 flex-1">
              <CardTitle>{action.title}</CardTitle>
              <p className="text-muted-foreground text-sm flex-1">{action.description}</p>
              <Button asChild>
                <Link href={action.href}>Go</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
