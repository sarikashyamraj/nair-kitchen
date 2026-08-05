"use client";

import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Package,
  Plus,
  ScanLine,
  ShoppingCart,
} from "lucide-react";

const actions = [
  {
    title: "Pantry",
    subtitle: "Ingredients",
    href: "/pantry",
    icon: Package,
    iconStyle: "bg-[#E8F3E9] text-[#2F6B3C]",
    hoverStyle: "hover:border-[#BFD9C3]",
  },
  {
    title: "Recipes",
    subtitle: "Cook & save",
    href: "/recipes",
    icon: BookOpen,
    iconStyle: "bg-[#FFF1D6] text-[#C9872F]",
    hoverStyle: "hover:border-[#E8C98D]",
  },
  {
    title: "Grocery",
    subtitle: "Shopping list",
    href: "/grocery",
    icon: ShoppingCart,
    iconStyle: "bg-[#EAF4FB] text-[#39769A]",
    hoverStyle: "hover:border-[#B8D8E9]",
  },
  {
    title: "Planner",
    subtitle: "Plan meals",
    href: "/planner",
    icon: CalendarDays,
    iconStyle: "bg-[#F0EAF8] text-[#75589A]",
    hoverStyle: "hover:border-[#D1C1E3]",
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-[#C9872F]">
  Quick Actions
</p>

<h2 className="mt-1 text-2xl font-bold text-[#2F6B3C] sm:text-3xl">
  Choose an Action
</h2>

<p className="mt-2 text-sm leading-6 text-gray-500">
  Jump to your most-used kitchen features.
</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group flex min-h-[108px] flex-col items-center justify-center rounded-2xl border border-[#F0E6D6] bg-[#FFFDF9] px-2 py-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95 ${action.hoverStyle}`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition duration-200 group-hover:scale-105 ${action.iconStyle}`}
              >
                <Icon size={21} strokeWidth={2.2} />
              </div>

              <p className="mt-2 text-sm font-bold text-[#2F6B3C]">
                {action.title}
              </p>

              <p className="mt-0.5 hidden text-[11px] text-gray-500 sm:block">
                {action.subtitle}
              </p>
            </Link>
          );
        })}

        <button
          type="button"
          disabled
          title="Quick Add will be enabled in a future update"
          className="flex min-h-[108px] cursor-not-allowed flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFE1D2] bg-[#F7FBF7] px-2 py-4 text-center opacity-70"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5F3E7] text-[#2F6B3C]">
            <Plus size={22} strokeWidth={2.3} />
          </div>

          <p className="mt-2 text-sm font-bold text-[#2F6B3C]">
            Quick Add
          </p>

          <p className="mt-0.5 hidden text-[11px] text-gray-500 sm:block">
            Coming soon
          </p>
        </button>

        <button
          type="button"
          disabled
          title="Ingredient scanning will be enabled in a future update"
          className="flex min-h-[108px] cursor-not-allowed flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4CED2] bg-[#FFF9FA] px-2 py-4 text-center opacity-70"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8E9EC] text-[#A65E6B]">
            <ScanLine size={22} strokeWidth={2.2} />
          </div>

          <p className="mt-2 text-sm font-bold text-[#6E434A]">
            Scan
          </p>

          <p className="mt-0.5 hidden text-[11px] text-gray-500 sm:block">
            Coming soon
          </p>
        </button>
      </div>
    </section>
  );
}