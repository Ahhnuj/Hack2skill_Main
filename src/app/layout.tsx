import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { APP_NAME, DISCLAIMER } from "@/lib/constants";
import { AppProvider } from "@/providers/AppProvider";
import { QueryProvider } from "@/providers/QueryProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — AI Wellness for Indian Students`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "MindMirror helps NEET, JEE, CUET, CAT, GATE, and UPSC aspirants monitor mental well-being through reflective journaling, pattern analysis, and empathetic AI support.",
  keywords: ["mental health", "NEET", "JEE", "student wellness", "AI companion"],
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} antialiased min-h-screen`}>
        <QueryProvider>
          <AppProvider>{children}</AppProvider>
        </QueryProvider>
        <footer className="sr-only">{DISCLAIMER}</footer>
      </body>
    </html>
  );
}
