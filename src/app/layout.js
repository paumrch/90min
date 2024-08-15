import { Analytics } from "@vercel/analytics/react";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "90 Minutes - La Liga Predictions",
  description:
    "90 Minutes is your go-to app for accurate predictions on Over and Under markets in the Spanish La Liga for the 2024-2025 season. Specializing in total goals predictions, this app provides expert insights for every match.",
  keywords:
    "La Liga, Spanish football, Over and Under, predictions, 2024-2025 season, total goals, football betting",
  author: "90 Minutes Team",
  og: {
    title: "90 Minutes - La Liga Predictions",
    description:
      "Expert predictions for the Spanish La Liga 2024-2025 season, focused on Over and Under goal markets.",
    url: "https://90minutes.xyz",
    image: "https://90minutes.xyz/featuredOG90Minutes.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "@90Minutes",
    title: "90 Minutes - La Liga Predictions",
    description:
      "Get the best Over and Under predictions for the Spanish La Liga 2024-2025 season.",
    image: "https://90minutes.xyz/featuredOG90Minutes.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={figtree.className}>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
