"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";

export function Navbar() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logoBlack.svg"
              alt="90 Minutes"
              width={40}
              height={40}
              className="dark:hidden"
            />
            <Image
              src="/logoWhite.svg"
              alt="90 Minutes"
              width={40}
              height={40}
              className="hidden dark:block"
            />
          </Link>
          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link href="/matches" className="hover:text-foreground">
              Matches
            </Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Change</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="hidden md:flex md:items-center md:gap-6">
                <Link href="/matches" className="hover:text-foreground">
                  Matches
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
