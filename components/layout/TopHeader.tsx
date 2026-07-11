"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export default function TopHeader() {
  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const formattedDate = now.toLocaleDateString("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-white rounded-2xl shadow-sm border border-[#F4E8D0] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 mb-6 lg:mb-8">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2F6B3C] leading-tight">
            {greeting}, Sarika 👋
          </h1>

          <p className="text-sm sm:text-base text-[#6B7280] mt-1">
            {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-xl border border-[#EADCC4] focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
            />
          </div>

          <button className="p-2 sm:p-3 rounded-xl hover:bg-[#F4E8D0] transition">
            <Bell size={21} />
          </button>

          <button className="p-2 sm:p-3 rounded-xl hover:bg-[#F4E8D0] transition">
            <UserCircle size={26} />
          </button>
        </div>
      </div>
    </header>
  );
}