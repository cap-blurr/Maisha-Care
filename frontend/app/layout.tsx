import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/style.css";
import "@rainbow-me/rainbowkit/styles.css";
import PrivyProviderContainer from "@/components/providers/privy-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Maisha Care",
  description: "Health Onchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PrivyProviderContainer>
          {children}
        </PrivyProviderContainer>
      </body>
    </html>
  );
}