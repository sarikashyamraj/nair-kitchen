"use client";

import Link from "next/link";
import {
  Menu,
  X,
  Home,
  CalendarDays,
  Package,
  BookOpen,
  ShoppingCart,
  WalletCards,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Planner", href: "/planner", icon: CalendarDays },
  { name: "Pantry", href: "/pantry", icon: Package },
  { name: "Recipes", href: "/recipes", icon: BookOpen },
  { name: "Grocery", href: "/grocery", icon: ShoppingCart },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Budget", href: "/budget", icon: WalletCards },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl border border-[#EADCC4] bg-white"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-lg font-bold text-[#2F6B3C]">
          Nair Kitchen
        </h1>

        <div className="w-10" />
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-[#2F6B3C]">
            Nair Kitchen
          </h2>

          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  pathname === item.href
                    ? "bg-[#2F6B3C] text-white"
                    : "hover:bg-[#F8F4EC]"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}