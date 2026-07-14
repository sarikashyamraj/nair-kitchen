"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  CalendarDays,
  Package,
  BookOpen,
  ShoppingCart,
  WalletCards,
  Settings,
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
  {
    href: "/budget",
    icon: WalletCards,
    label: "Budget",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-[#EADCC4] bg-white shadow-sm">
      {/* Brand */}
      <div className="border-b border-[#F4E8D0] px-6 py-7">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl transition hover:bg-[#FFF8EC]"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#EADCC4] bg-[#FFF8EC] shadow-sm">
            <Image
              src="/branding/kitchen-brain-icon.png"
              alt="Kitchen Brain"
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#174D2A]">
              <span className="block">Kitchen</span>
<span className="block text-[#C88A22]">Brain</span>
            </h1>

            <p className="mt-1 text-[11px] leading-4 text-gray-500">
              Plan Meals. Shop Smarter.
              <br />
              Live Easier.
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-5 py-8">
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
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb
              size={18}
              className="text-[#D89B3C]"
            />

            <h3 className="font-semibold text-[#5A4032]">
              Kitchen Tip
            </h3>
          </div>

          <p className="text-sm leading-6 text-gray-600">
            Planning your meals for the week can reduce food waste,
            save money, and make cooking stress-free.
          </p>
        </div>
      </div>
    </aside>
  );
}