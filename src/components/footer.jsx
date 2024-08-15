import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {currentYear}. 90 Minutes. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal-advice"
              className="text-sm text-muted-foreground hover:underline"
            >
              Legal Notice
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:underline"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
