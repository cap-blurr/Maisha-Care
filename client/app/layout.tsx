import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/style.css";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { cookieToInitialState } from "wagmi";

import AppKitContextProvider from "@/context/appkit";
import RainbowKitContainer from "@/context/rainbowkit";
import { useState } from "react";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";

const OnchainProviders = dynamic(() => import("../context/onchain-provider"), {
  ssr: false,
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <AppKitContextProvider cookies={cookies}> */}
        {/* <RainbowKitContainer> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <OnchainProviders>{children}</OnchainProviders>
        </ThemeProvider>
        {/* </RainbowKitContainer> */}
        {/* </AppKitContextProvider> */}
      </body>
    </html>
  );
}
