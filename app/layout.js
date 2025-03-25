import { Inter } from "next/font/google";
import "./globals.css";
import AppTheme from "./shared-theme/AppTheme"; 

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Price is Right",
  description: "Blank for now",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="__variable_835dce" cz-shortcut-listen="true">
        <AppTheme>
          {children}
        </AppTheme>
      </body>
    </html>
  );
}