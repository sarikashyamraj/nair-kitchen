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

import {
  typography,
} from "../../lib/theme/typography";

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
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2
            className={`${typography.sectionTitle} text-[#1F5A33]`}
          >
            Categories
          </h2>

          <p
            className={`${typography.pageDescription} mt-1 text-[#7A746C]`}
          >
            Browse your home inventory by category.
          </p>
        </div>

        <span
          className={`${typography.badge} shrink-0 rounded-full bg-[#F8F4EC] px-2.5 py-1 font-medium text-[#8B8177]`}
        >
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

                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
                    <ChevronRight
                      size={15}
                      strokeWidth={1.8}
                      className="text-[#2F6B3C]"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5">
                  <h3
                    className={`${typography.cardTitle} truncate text-[#1F5A33]`}
                  >
                    {category.label}
                  </h3>

                  <p
                    className={`${typography.caption} mt-1 text-[#8A8178]`}
                  >
                    {summary.totalItems}{" "}
                    {summary.totalItems ===
                    1
                      ? "item"
                      : "items"}
                  </p>

                  <div className="mt-2.5 min-h-5">
                    {summary.outOfStock >
                    0 ? (
                      <div
                        className={`${typography.caption} flex items-center gap-1.5 font-medium text-red-600`}
                      >
                        <CircleAlert
                          size={12}
                          strokeWidth={1.9}
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
                      <div
                        className={`${typography.caption} flex items-center gap-1.5 font-medium text-[#B87516]`}
                      >
                        <CircleAlert
                          size={12}
                          strokeWidth={1.9}
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
                      <div
                        className={`${typography.caption} flex items-center gap-1.5 font-medium text-[#2F7A49]`}
                      >
                        <CircleCheck
                          size={12}
                          strokeWidth={1.9}
                        />

                        <span>
                          All stocked
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`${typography.caption} text-[#AAA39B]`}
                      >
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