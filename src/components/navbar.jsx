"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export function Navbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const updateTheme = () => {
      const newTheme = document.documentElement.getAttribute("data-theme");
      setTheme(newTheme === "dark" ? "dark" : "light");
    };

    // Configurar el tema inicial
    updateTheme();

    // Observar cambios en el atributo data-theme
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={theme === "light" ? "/logoWhite.svg" : "/logoBlack.svg"}
              alt="Acme Inc Logo"
              width={40}
              height={40}
            />
          </Link>
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Alternar menú de navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src={theme === "light" ? "/logoWhite.svg" : "/logoBlack.svg"}
                    alt="Acme Inc Logo"
                    width={40}
                    height={40}
                  />
                </Link>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
