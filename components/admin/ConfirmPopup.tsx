"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface ConfirmPopupProps {
  id: string;
}

async function deleteSubscriptionPlan(planId: string) {
  try {
    const response = await fetch(`/api/admin/delete-subscription-plan?planId=${planId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete subscription plan');
    }
    
    toast.success('Subscription plan deleted successfully');
    // Refresh the page to show updated list
    window.location.reload();
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    toast.error('Failed to delete subscription plan');
  }
}

export function ConfirmPopup({ id }: ConfirmPopupProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="font-semibold w-full mt-2" size="lg">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the subscription plan
            and deactivate it in Stripe.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteSubscriptionPlan(id)}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
