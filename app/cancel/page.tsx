export default function CancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-lg">
        <div className="flex justify-center">
          <svg
            className="h-16 w-16 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold">Subscription cancelled</h1>
        <p className="text-xl text-muted-foreground">
          Your subscription was not completed. You can try again whenever you're ready.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <a
            href="/pricing"
            className="text-primary hover:text-primary/90"
          >
            Return to pricing →
          </a>
        </div>
      </div>
    </div>
  );
} 