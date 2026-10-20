import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrueSunshine ",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen w-full overflow-x-hidden bg-gray-50`}
        >
          {children}

          {/* Razorpay Checkout Script */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
          />

          <ToastContainer
            position="bottom-right"
            theme="dark"
            limit={2}
            autoClose={2000}
            hideProgressBar
            closeButton={false}
            className="md:!bottom-6 md:!right-6 !bottom-4 !left-1/2 !-translate-x-1/2 md:!translate-x-0"
            toastClassName="!rounded-xl !px-4 !py-2 !min-h-0 !w-auto !max-w-[320px] text-sm"
          />
        </body>
      </html>
    </ClerkProvider>
  );
}