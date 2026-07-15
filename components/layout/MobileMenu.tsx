"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "../auth/LogoutButton";
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

const menuItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Planner",
    href: "/planner",
    icon: CalendarDays,
  },
  {
    name: "Pantry",
    href: "/pantry",
    icon: Package,
  },
  {
    name: "Recipes",
    href: "/recipes",
    icon: BookOpen,
  },
  {
    name: "Grocery",
    href: "/grocery",
    icon: ShoppingCart,
  },
  {
    name: "Budget",
    href: "/budget",
    icon: WalletCards,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#F4E8D0] bg-white px-4 py-3 md:hidden">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
        >
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[#EADCC4] bg-[#FFF8EC] shadow-sm">
            <Image
              src="/branding/kitchen-brain-icon.png"
              alt="Kitchen Brain"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold leading-tight text-[#174D2A]">
              Kitchen{" "}
              <span className="text-[#C88A22]">
                Brain
              </span>
            </h2>

            <p className="truncate text-[9px] leading-4 text-gray-500">
              Plan Meals. Shop Smarter. Live Easier.
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EADCC4] bg-[#FFF8EC] text-[#2F6B3C] shadow-sm transition hover:bg-[#F4E8D0]"
        >
          <Menu size={23} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl transition-transform duration-300 md:hidden ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Drawer Brand */}
        <div className="flex items-center justify-between border-b border-[#F4E8D0] p-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#EADCC4] bg-[#FFF8EC] shadow-sm">
              <Image
                src="/branding/kitchen-brain-icon.png"
                alt="Kitchen Brain"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-semibold leading-tight text-[#174D2A]">
                Kitchen{" "}
                <span className="text-[#C88A22]">
                  Brain
                </span>
              </h2>

              <p className="mt-0.5 text-[9px] leading-4 text-gray-500">
                Plan Meals. Shop Smarter.
                <br />
                Live Easier.
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#5A4032] transition hover:bg-[#F4E8D0]"
          >
            <X size={23} />
          </button>
        </div>

        {/* Navigation */}
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

          {/* Logout */}
          <LogoutButton />
        </nav>
        
      </aside>
    </>
  );
}