"use client";

import Sidebar from "./Sidebar";
import MobileMenu from "./layout/MobileMenu";
import TopHeader from "./layout/TopHeader";
import AppLoader from "./common/AppLoader";

import { useKitchen } from "../context/KitchenContext";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {
  const { isKitchenLoaded } = useKitchen();

  if (!isKitchenLoaded) {
    return <AppLoader />;
  }

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

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}