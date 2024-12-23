// 'use client';

import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { PrivyProviderWrapper } from '@/providers/PrivyProvider';
import dynamic from "next/dynamic";

const BufferProvider = dynamic(
  () => import("@/components/providers/buffer-provider"),
  {
    ssr: false,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <BufferProvider>
        <PrivyProviderWrapper>
          {children}
        </PrivyProviderWrapper>
      </BufferProvider>
    </ThemeProvider>
  );
} 