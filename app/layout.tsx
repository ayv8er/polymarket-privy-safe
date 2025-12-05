import Providers from "@/providers";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/utils/classNames";
import "./globals.css";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polymarket Safe Trader - Privy EOA",
  description:
    "Polymarket demo using Privy for authentication and embedded wallets, trading through a Safe Wallet using the CLOB and Relayer client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(geistSans.variable, geistMono.variable, "antialiased")}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
