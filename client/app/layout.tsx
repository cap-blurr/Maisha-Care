import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/styles/style.css";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
// import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import PrivyProviderContainer from "@/components/providers/privy-provider";
import { Toaster } from "sonner";

// Dynamic imports
const OnchainProviders = dynamic(() => import("../context/onchain-provider"), {
  ssr: false,
});

const BufferProvider = dynamic(
  () => import("@/components/providers/buffer-provider"),
  {
    ssr: false,
  }
);

// Font configurations
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <BufferProvider>
            <PrivyProviderContainer>
              <OnchainProviders>{children}</OnchainProviders>
              <Toaster richColors position="top-center" />
            </PrivyProviderContainer>
          </BufferProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
