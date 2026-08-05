"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

interface GroceryProgressProps {
  totalItems: number;
  purchasedItems: number;
}

export default function GroceryProgress({
  totalItems,
  purchasedItems,
}: GroceryProgressProps) {
  const remainingItems = Math.max(
    totalItems - purchasedItems,
    0
  );

  const completionPercentage =
    totalItems === 0
      ? 0
      : Math.round(
          (purchasedItems / totalItems) * 100
        );

  return (
    <section className="rounded-3xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#C9872F]">
            Grocery Progress
          </p>

          <h2 className="mt-1 text-xl font-bold text-[#2F6B3C] sm:text-2xl">
            Shopping Status
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {totalItems === 0
              ? "Your grocery list is currently empty."
              : `${purchasedItems} of ${totalItems} items purchased.`}
          </p>
        </div>

        <Link
          href="/grocery"
          className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#EADCC4] bg-[#FFF8EC] px-3 py-2 text-sm font-semibold text-[#5A4032] transition hover:bg-[#F4E8D0]"
        >
          Grocery
          <ChevronRight size={16} />
        </Link>
      </div>

      {totalItems === 0 ? (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700">
            <ShoppingCart size={21} />
          </div>

          <div>
            <p className="font-bold text-blue-800">
              No Grocery Items
            </p>

            <p className="mt-1 text-sm text-blue-700">
              Add items when you are ready to shop.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-[#F0E6D6] bg-[#FFFDF9] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FB] text-[#39769A]">
                {completionPercentage === 100 ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <ShoppingCart size={22} />
                )}
              </div>

              <div>
                <p className="text-2xl font-bold text-[#2F6B3C]">
                  {completionPercentage}%
                </p>

                <p className="text-sm text-gray-500">
                  Complete
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-[#5A4032]">
                {remainingItems}
              </p>

              <p className="text-sm text-gray-500">
                {remainingItems === 1
                  ? "item remaining"
                  : "items remaining"}
              </p>
            </div>
          </div>

          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#E8ECE8]">
            <div
              className="h-full rounded-full bg-[#2F6B3C] transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
            {completionPercentage === 100
              ? "Your grocery shopping is complete."
              : `${purchasedItems} purchased and ${remainingItems} still pending.`}
          </p>
        </div>
      )}
    </section>
  );
}