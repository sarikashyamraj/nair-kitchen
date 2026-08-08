import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import { KitchenProvider } from "../context/KitchenContext";
import { ToastProvider } from "../context/ToastContext";

const plusJakartaSans =
  Plus_Jakarta_Sans({
    variable:
      "--font-plus-jakarta-sans",
    subsets: ["latin"],
    display: "swap",
  });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kitchen Brain",
    template:
      "%s | Kitchen Brain",
  },

  description:
    "Plan meals, manage your pantry, organize recipes, shop smarter, and simplify everyday family life with Kitchen Brain.",

  applicationName:
    "Kitchen Brain",

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
    icon:
      "/branding/kitchen-brain-icon.png",
    apple:
      "/branding/kitchen-brain-icon.png",
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
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <KitchenProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </KitchenProvider>
      </body>
    </html>
  );
}