"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import LogoutButton from "../auth/LogoutButton";

import {
  BookOpen,
  CalendarDays,
  Home,
  Package,
  Settings,
  ShoppingCart,
  WalletCards,
  X,
} from "lucide-react";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

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

function isRouteActive(
  pathname: string,
  href: string
) {
  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        aria-hidden={!open}
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-xl transition-transform duration-300 md:hidden ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#F4E8D0] p-4">
          <Link
            href="/"
            onClick={onClose}
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
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#5A4032] transition hover:bg-[#F4E8D0]"
          >
            <X size={23} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              isRouteActive(
                pathname,
                item.href
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                  isActive
                    ? "bg-[#2F6B3C] text-white shadow-sm"
                    : "text-[#5A4032] hover:bg-[#F8F4EC]"
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#F4E8D0] p-4">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}