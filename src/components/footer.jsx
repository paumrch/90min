import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {currentYear} Acme Inc. Todos los derechos reservados.
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/legal-advice" className="hover:underline">
            Legal Advice
          </Link>
        </nav>
      </div>
    </footer>
  )
}