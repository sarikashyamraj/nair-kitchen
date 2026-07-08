"use client";

import Link from "next/link";
import {
  Package,
  ShoppingCart,
  BookOpen,
  CalendarDays,
} from "lucide-react";

const actions = [
  {
    title: "Pantry",
    subtitle: "Manage ingredients",
    href: "/pantry",
    icon: Package,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Recipes",
    subtitle: "Cook something tasty",
    href: "/recipes",
    icon: BookOpen,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Grocery",
    subtitle: "Shopping list",
    href: "/grocery",
    icon: ShoppingCart,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Planner",
    subtitle: "Weekly meals",
    href: "/planner",
    icon: CalendarDays,
    color: "bg-purple-100 text-purple-700",
  },
];

export default function QuickActions() {
  return (
    <section className="bg-white rounded-2xl border border-[#EADCC4] shadow-sm p-6">
      <h2 className="text-2xl font-bold text-[#2F6B3C]">
        ⚡ Quick Actions
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="rounded-2xl border border-[#F4E8D0] bg-[#FFFCF8] p-5 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}
              >
                <Icon size={24} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-[#2F6B3C]">
                {action.title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {action.subtitle}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}