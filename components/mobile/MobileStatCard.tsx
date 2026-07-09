"use client";

import { LucideIcon } from "lucide-react";

type MobileStatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
};

export default function MobileStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "bg-green-100 text-green-700",
}: MobileStatCardProps) {
  return (
    <div className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
      >
        <Icon size={20} />
      </div>

      <p className="text-2xl font-bold text-[#5A4032]">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#2F6B3C]">
        {title}
      </p>

      {subtitle && (
        <p className="mt-1 text-xs text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}