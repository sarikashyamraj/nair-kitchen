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
    <header className="bg-white rounded-2xl shadow-sm border border-[#F4E8D0] px-8 py-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#2F6B3C]">
            {greeting}, Sarika 👋
          </h1>

          <p className="text-[#6B7280] mt-1">
            {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-xl border border-[#EADCC4] focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
            />
          </div>

          <button className="p-3 rounded-xl hover:bg-[#F4E8D0] transition">
            <Bell size={22} />
          </button>

          <button className="p-3 rounded-xl hover:bg-[#F4E8D0] transition">
            <UserCircle size={28} />
          </button>
        </div>
      </div>
    </header>
  );
}