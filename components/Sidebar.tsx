"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarDays,
  Package,
  BookOpen,
  ShoppingCart,
  ChefHat,
  Lightbulb,
} from "lucide-react";

const menuItems = [
  {
    href: "/",
    icon: Home,
    label: "Dashboard",
  },
  {
    href: "/planner",
    icon: CalendarDays,
    label: "Planner",
  },
  {
    href: "/pantry",
    icon: Package,
    label: "Pantry",
  },
  {
    href: "/recipes",
    icon: BookOpen,
    label: "Recipes",
  },
  {
    href: "/grocery",
    icon: ShoppingCart,
    label: "Grocery",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-[#EADCC4] shadow-sm flex flex-col">

      {/* Logo */}
      <div className="px-8 py-8 border-b border-[#F4E8D0]">
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-[#2F6B3C] flex items-center justify-center shadow-lg">
            <ChefHat className="w-8 h-8 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#2F6B3C]">
              Nair Kitchen
            </h1>

            <p className="text-sm text-gray-500">
              Smart Family Kitchen
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5 py-8 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-5 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-[#2F6B3C] text-white shadow-md"
                  : "text-[#5A4032] hover:bg-[#F4E8D0] hover:text-[#2F6B3C]"
              }`}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* Kitchen Tip */}
      <div className="border-t border-[#F4E8D0] p-6">

        <div className="rounded-2xl border border-[#F4E8D0] bg-[#FFF8EC] p-4">

          <div className="flex items-center gap-2 mb-3">

            <Lightbulb
              size={18}
              className="text-[#D89B3C]"
            />

            <h3 className="font-semibold text-[#5A4032]">
              Kitchen Tip
            </h3>

          </div>

          <p className="text-sm text-gray-600 leading-6">
            Planning your meals for the week can reduce food waste,
            save money, and make cooking stress-free.
          </p>

        </div>

      </div>

    </aside>
  );
}