"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Package,
  ShoppingCart,
  BookOpen,
  CalendarDays,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    label: "Pantry",
    href: "/pantry",
    icon: Package,
  },
  {
    label: "Grocery",
    href: "/grocery",
    icon: ShoppingCart,
  },
  {
    label: "Recipes",
    href: "/recipes",
    icon: BookOpen,
  },
  {
    label: "Planner",
    href: "/planner",
    icon: CalendarDays,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EADCC4] bg-white/95 backdrop-blur-md md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)]">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-colors"
            >
              <Icon
                size={22}
                className={
                  isActive
                    ? "text-[#2F6B3C]"
                    : "text-gray-500"
                }
              />

              <span
                className={`text-[11px] font-medium ${
                  isActive
                    ? "text-[#2F6B3C]"
                    : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}