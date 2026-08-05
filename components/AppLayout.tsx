"use client";

import Sidebar from "./Sidebar";
import MobileMenu from "./layout/MobileMenu";
import TopHeader from "./layout/TopHeader";

import { useKitchen } from "../context/KitchenContext";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const { isKitchenLoaded } = useKitchen();

  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:p-8">
            <div className="sticky top-0 z-40 bg-[#FFFDF8] pb-3">
              <MobileMenu />
              <TopHeader />
            </div>

            {!isKitchenLoaded && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#EADCC4] bg-white px-4 py-3 shadow-sm">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#D89B3C]" />

                <p className="text-sm font-medium text-[#5A4032]">
                  Syncing your kitchen data...
                </p>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}