"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Package,
} from "lucide-react";

interface PantryAlertItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface PantryAlertsProps {
  items: PantryAlertItem[];
}

export default function PantryAlerts({
  items,
}: PantryAlertsProps) {
  const visibleItems = items.slice(0, 4);
  const remainingCount = Math.max(
    items.length - visibleItems.length,
    0
  );

  return (
    <section className="rounded-3xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#C9872F]">
            Pantry Alerts
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#2F6B3C] sm:text-2xl">
            Items Needing Attention
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {items.length === 0
              ? "Your pantry is currently well stocked."
              : `${items.length} low-stock ${
                  items.length === 1 ? "item" : "items"
                } found.`}
          </p>
        </div>

        <Link
          href="/pantry"
          className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EADCC4] bg-[#FFF8EC] px-3 py-2 text-sm font-semibold text-[#5A4032] transition hover:bg-[#F4E8D0]"
        >
          Pantry
          <ChevronRight size={16} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-700">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <p className="font-bold text-green-800">
              Pantry Healthy
            </p>

            <p className="mt-1 text-sm text-green-700">
              No pantry items need attention today.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#F0E6D6] bg-[#FFFDF9]">
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                index !== visibleItems.length - 1 ||
                remainingCount > 0
                  ? "border-b border-[#F0E6D6]"
                  : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF1D6] text-[#C9872F]">
                <Package size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-[#2F6B3C]">
                  {item.name}
                </p>

                <p className="mt-0.5 text-sm text-gray-500">
                  {item.quantity} {item.unit} remaining
                </p>
              </div>

              <AlertTriangle
                size={18}
                className="shrink-0 text-amber-600"
              />
            </div>
          ))}

          {remainingCount > 0 && (
            <Link
              href="/pantry"
              className="flex items-center justify-center gap-1 px-4 py-3 text-sm font-semibold text-[#2F6B3C] transition hover:bg-[#F8F2E8]"
            >
              View {remainingCount} more
              <ChevronRight size={15} />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}