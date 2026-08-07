"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpen,
  CalendarDays,
  Home,
  Package,
  ShoppingCart,
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

function isRouteActive(
  pathname: string,
  href: string
) {
  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    )
  );
}

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EADCC4] bg-white/95 shadow-[0_-4px_18px_rgba(90,64,50,0.08)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid max-w-[480px] grid-cols-5 px-1 pb-[calc(env(safe-area-inset-bottom)+4px)] pt-1">
        {navigationItems.map(
          (item) => {
            const Icon =
              item.icon;

            const isActive =
              isRouteActive(
                pathname,
                item.href
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive
                    ? "page"
                    : undefined
                }
                className={[
                  "relative",
                  "flex",
                  "min-h-[58px]",
                  "min-w-0",
                  "flex-col",
                  "items-center",
                  "justify-center",
                  "gap-1",
                  "rounded-xl",
                  "px-1",
                  "transition",
                  "duration-200",
                  "active:scale-[0.96]",
                  isActive
                    ? "text-[#2F6B3C]"
                    : "text-[#6B7280]",
                ].join(
                  " "
                )}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 h-[3px] w-9 rounded-full bg-[#2F6B3C]"
                  />
                )}

                <div
                  className={[
                    "flex",
                    "h-7",
                    "w-9",
                    "items-center",
                    "justify-center",
                    "rounded-lg",
                    "transition",
                    "duration-200",
                    isActive
                      ? "bg-[#EEF7F0]"
                      : "bg-transparent",
                  ].join(
                    " "
                  )}
                >
                  <Icon
                    size={21}
                    strokeWidth={
                      isActive
                        ? 2.4
                        : 1.9
                    }
                  />
                </div>

                <span
                  className={[
                    "truncate",
                    "text-[10px]",
                    "leading-none",
                    isActive
                      ? "font-bold"
                      : "font-medium",
                  ].join(
                    " "
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }
        )}
      </div>
    </nav>
  );
}