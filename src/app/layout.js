import { ThemeProvider } from "@/components/theme-provider";

import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "90min",
  description: "90min",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={figtree.className}>
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
