export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-6 md:flex md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Next.js SaaS Template. All rights reserved.
          </p>
        </div>
        <div className="mt-4 flex justify-center space-x-6 md:mt-0">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">
            Documentation
          </a>
          <a href="https://github.com/vitalflowcreative/DoodleLabAi" className="text-sm text-muted-foreground hover:text-primary" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">
            License
          </a>
        </div>
      </div>
    </footer>
  );
} 