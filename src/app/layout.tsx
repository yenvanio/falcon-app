import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/navbar";
import {Toaster} from "@/components/ui/toaster";
import {MapProvider} from "@/lib/maps/map-provider";

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
      <body className={inter.className}>
      <Navbar/>
      <MapProvider>
          {children}
      </MapProvider>
      <Toaster />
      </body>
    </html>
  );
}
