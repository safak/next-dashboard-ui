import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/context/them-provider";
import { auth } from "@/auth";
import { SessionProvider } from 'next-auth/react'
import { SocketProvider } from "@/components/providers/socket-provider";

const comfortaa = Comfortaa({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IDEE IPTV Management",
  description: "IPTV System for management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={comfortaa.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SocketProvider>
              {children}
            </SocketProvider>
          </ThemeProvider>
          <Toaster richColors position="top-center" />
        </body>
      </html>
    </SessionProvider>
  );
}
