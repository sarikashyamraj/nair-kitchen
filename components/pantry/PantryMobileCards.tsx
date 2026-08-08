"use client";

import Image from "next/image";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import { PantryItem } from "../../types/pantry";

import {
  getPantryStatusClasses,
  getPantryStatusLabel,
  getPantryStockStatus,
} from "../../lib/pantry/pantryStatus";

import {
  getIngredientImage,
} from "../../lib/ingredients/getIngredientImage";

import {
  typography,
} from "../../lib/theme/typography";

type PantryMobileCardsProps = {
  items: PantryItem[];
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
};

export default function PantryMobileCards({
  items,
  onEdit,
  onDelete,
}: PantryMobileCardsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#EADCC4] bg-white p-6 text-center shadow-sm md:hidden">
        <p
          className={`${typography.cardTitle} text-[#2F6B3C]`}
        >
          No items found
        </p>

        <p
          className={`${typography.body} mt-1 text-[#7A746C]`}
        >
          Try another search, category or sort option.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-32 md:hidden">
      {items.map((item) => {
        const status =
          getPantryStockStatus(
            item
          );

        const statusLabel =
          getPantryStatusLabel(
            status
          );

        const statusClasses =
          getPantryStatusClasses(
            status
          );

        const availableClass =
          status ===
          "out_of_stock"
            ? "text-red-600"
            : status ===
                "low_stock"
              ? "text-[#B87516]"
              : "text-[#245B32]";

        const imageSrc =
          getIngredientImage(
            item.name,
            item.category
          );

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-[#E8DED1] bg-white shadow-sm"
          >
            <div className="p-4">
              {/* Item Header */}
              <div className="flex items-start gap-3.5">
                <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl border border-[#F0E7DA] bg-[#FAF8F3]">
                  <Image
                    src={imageSrc}
                    alt={item.name}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`${typography.itemTitle} min-w-0 truncate text-[#1F5A33]`}
                    >
                      {item.name}
                    </h3>

                    <span
                      className={`${typography.badge} inline-flex shrink-0 rounded-full px-2.5 py-1 ${statusClasses.badge}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  {item.notes && (
                    <p
                      className={`${typography.caption} mt-2 line-clamp-2 text-[#8A8178]`}
                    >
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Stock Information */}
              <div className="mt-4 grid grid-cols-3 divide-x divide-[#F0E7DA]">
                <div className="pr-3">
                  <p
                    className={`${typography.label} text-[#938A81]`}
                  >
                    Available
                  </p>

                  <p
                    className={`${typography.bodyMedium} mt-1 ${availableClass}`}
                  >
                    {item.quantity}{" "}
                    {item.unit}
                  </p>
                </div>

                <div className="px-3">
                  <p
                    className={`${typography.label} text-[#938A81]`}
                  >
                    Minimum
                  </p>

                  <p
                    className={`${typography.bodyMedium} mt-1 text-[#5A4032]`}
                  >
                    {
                      item.minQuantity
                    }{" "}
                    {item.unit}
                  </p>
                </div>

                <div className="pl-3">
                  <p
                    className={`${typography.label} text-[#938A81]`}
                  >
                    Category
                  </p>

                  <p
                    className={`${typography.bodyMedium} mt-1 truncate text-[#5A4032]`}
                  >
                    {item.category}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 border-t border-[#F0E7DA]">
              <button
                type="button"
                onClick={() =>
                  onEdit(item)
                }
                className={`${typography.button} flex min-h-11 items-center justify-center gap-2 border-r border-[#F0E7DA] text-[#2F6B3C] transition hover:bg-[#F7FBF7] active:bg-green-50`}
              >
                <Pencil
                  size={15}
                  strokeWidth={1.9}
                />

                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(
                    item.id
                  )
                }
                className={`${typography.button} flex min-h-11 items-center justify-center gap-2 text-red-600 transition hover:bg-red-50/60 active:bg-red-50`}
              >
                <Trash2
                  size={15}
                  strokeWidth={1.9}
                />

                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}