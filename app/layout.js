import { Inter } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import "./globals.css";
import AppTheme from "./shared-theme/AppTheme";

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Smart Finder",
  description: "Sandwich Perfection Awaits — Let Your Taste Buds Lead the Way."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}><StackProvider app={stackServerApp}><StackTheme>
        <AppTheme>
          {children}
        </AppTheme>
      </StackTheme></StackProvider></body>
    </html>
  );
}