import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { KitchenProvider } from "../context/KitchenContext";
import { ToastProvider } from "../context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kitchen Brain",
    template: "%s | Kitchen Brain",
  },
  description:
    "Plan meals, manage your pantry, organize recipes, shop smarter, and simplify everyday family life with Kitchen Brain.",
  applicationName: "Kitchen Brain",
  keywords: [
    "Kitchen Brain",
    "meal planner",
    "family meal planning",
    "pantry management",
    "grocery planner",
    "grocery budget",
    "recipe manager",
    "smart kitchen app",
  ],
  authors: [
    {
      name: "Sarika Nair",
    },
  ],
  icons: {
    icon: "/branding/kitchen-brain-icon.png",
    apple: "/branding/kitchen-brain-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <KitchenProvider>
          <ToastProvider>{children}</ToastProvider>
        </KitchenProvider>
      </body>
    </html>
  );
}