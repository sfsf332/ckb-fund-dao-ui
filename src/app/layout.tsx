import type { Metadata } from "next";
import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import { Toaster } from "react-hot-toast";
import TooltipClient from "@/components/TooltipClient";

import { I18nProvider } from "../contexts/I18nContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { LayoutProvider } from "./layoutProvider";
import Banner from "@/components/Banner";

export const metadata: Metadata = {
  title: "CKB CFD",
  description: "CKB Community Fund DAO - 治理平台",
  icons: {
    icon: "/nervos-logo.svg",
    shortcut: "/nervos-logo.svg",
    apple: "/nervos-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning={true}>
        <LayoutProvider>
          <I18nProvider>
            <Header />
            <Banner />
            <main className="min-h-screen">{children}</main>
            <TooltipClient />
            <Footer />
            <Toaster position="top-center" toastOptions={{ duration: 1500 }} />
          </I18nProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
