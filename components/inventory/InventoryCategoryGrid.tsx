"use client";

import Image from "next/image";

import {
  ChevronRight,
  CircleAlert,
  CircleCheck,
} from "lucide-react";

import { PantryItem } from "../../types/pantry";

import {
  inventoryCategoryMeta,
  HomeInventoryCategory,
} from "../../lib/inventory/inventoryCategories";

import {
  analyzeInventoryCategory,
} from "../../lib/inventory/inventoryCategoryAnalyzer";

import {
  inventoryCategoryImages,
} from "../../lib/inventory/inventoryCategoryImages";

type InventoryCategoryGridProps = {
  items: PantryItem[];

  onCategorySelect: (
    category: HomeInventoryCategory
  ) => void;
};

export default function InventoryCategoryGrid({
  items,
  onCategorySelect,
}: InventoryCategoryGridProps) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#245B32] sm:text-xl">
            Categories
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Browse your home inventory by category.
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#F8F4EC] px-2.5 py-1 text-[11px] font-semibold text-gray-500">
          {inventoryCategoryMeta.length} total
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {inventoryCategoryMeta.map(
          (category) => {
            const summary =
              analyzeInventoryCategory(
                items,
                category.name
              );

            const image =
              inventoryCategoryImages[
                category.name
              ];

            return (
              <button
                key={category.name}
                type="button"
                onClick={() =>
                  onCategorySelect(
                    category.name
                  )
                }
                className="group overflow-hidden rounded-2xl border border-[#EADCC4] bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              >
                {/* Image */}
                <div className="relative h-28 overflow-hidden bg-[#F8F4EC]">
                  <Image
  src={image}
  alt={category.label}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="object-cover object-[center_15%] transition duration-300 group-hover:scale-[1.03]"
/>

                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm">
                    <ChevronRight
                      size={16}
                      className="text-[#245B32]"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-3">
                  <h3 className="truncate font-bold text-[#245B32]">
                    {category.label}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    {summary.totalItems}{" "}
                    {summary.totalItems ===
                    1
                      ? "item"
                      : "items"}
                  </p>

                  <div className="mt-2 min-h-5">
                    {summary.outOfStock >
                    0 ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600">
                        <CircleAlert
                          size={13}
                        />

                        <span>
                          {
                            summary.outOfStock
                          }{" "}
                          out of stock
                        </span>
                      </div>
                    ) : summary.lowStock >
                      0 ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C47A00]">
                        <CircleAlert
                          size={13}
                        />

                        <span>
                          {
                            summary.lowStock
                          }{" "}
                          running low
                        </span>
                      </div>
                    ) : summary.totalItems >
                      0 ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700">
                        <CircleCheck
                          size={13}
                        />

                        <span>
                          All stocked
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-gray-400">
                        No items yet
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>
    </section>
  );
}