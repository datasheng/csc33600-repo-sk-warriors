import { Inter } from "next/font/google";
import "./globals.css";

// Initialize the Inter font
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Price is Right",
  description: "Lebron",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="__variable_835dce" cz-shortcut-listen="true">
      {children}
      </body>
    </html>
  );
}