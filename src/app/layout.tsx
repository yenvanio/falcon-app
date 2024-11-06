import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Falcon",
  description: "Travel Itinerary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <link rel="icon" href="/icon.svg" sizes="any"/>
      <body className="h-100vh w-full overflow-y-hidden">
      {children}
      <Toaster/>
      </body>
      </html>
  );
}
