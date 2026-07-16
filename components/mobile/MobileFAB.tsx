"use client";

import { Plus } from "lucide-react";

type MobileFABProps = {
  label?: string;
  onClick: () => void;
};

export default function MobileFAB({
  label = "Add",
  onClick,
}: MobileFABProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full bg-[#2F6B3C] px-5 py-4 text-white shadow-xl hover:bg-[#24552F] transition"
    >
      <Plus size={22} />

      <span className="font-semibold">
        {label}
      </span>
    </button>
  );
}