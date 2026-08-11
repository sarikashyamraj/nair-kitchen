"use client";

import Image from "next/image";

import {
  Check,
  Pencil,
  Trash2,
} from "lucide-react";

import { ShoppingItem } from "../../types/shopping";

import {
  getIngredientImage,
} from "../../lib/ingredients/getIngredientImage";

import {
  typography,
} from "../../lib/theme/typography";

type ShoppingMobileCardsProps = {
  items: ShoppingItem[];

  onTogglePurchased: (
    id: string
  ) => void;

  onEdit: (
    item: ShoppingItem
  ) => void;

  onDelete: (
    id: string
  ) => void;
};

export default function ShoppingMobileCards({
  items,
  onTogglePurchased,
  onEdit,
  onDelete,
}: ShoppingMobileCardsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#E8DED1] bg-white p-6 text-center shadow-sm md:hidden">
        <p
          className={`${typography.cardTitle} text-[#2F6B3C]`}
        >
          No grocery items
        </p>

        <p
          className={`${typography.body} mt-1 text-[#7A746C]`}
        >
          Add an item or generate your list from Home Inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-32 md:hidden">
      {items.map((item) => {
        const imageSrc =
          getIngredientImage(
            item.name,
            item.category
          );

        return (
          <article
            key={item.id}
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
              item.purchased
                ? "border-green-100 bg-[#F8FCF8]"
                : "border-[#E8DED1]"
            }`}
          >
            {/* Main Content */}
            <div className="p-3.5">
              <div className="flex items-center gap-3">

                {/* Item Image */}
                <div
                  className={`relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-xl border border-[#F0E7DA] bg-[#FAF8F3] ${
                    item.purchased
                      ? "opacity-70"
                      : ""
                  }`}
                >
                  <Image
                    src={imageSrc}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={(event) => {
                      event.currentTarget.srcset =
                        "";

                      event.currentTarget.src =
                        "/inventory/inventory-health.png";
                    }}
                  />
                </div>

                {/* Item Information */}
                <div className="min-w-0 flex-1">
                  <h3
                    className={`${typography.itemTitle} truncate ${
                      item.purchased
                        ? "text-[#8A938C] line-through"
                        : "text-[#1F5A33]"
                    }`}
                  >
                    {item.name}
                  </h3>

                  <p
                    className={`${typography.bodyMedium} mt-1 ${
                      item.purchased
                        ? "text-[#8A938C]"
                        : "text-[#5A4032]"
                    }`}
                  >
                    {item.quantity}
                  </p>

                  <p
                    className={`${typography.caption} mt-0.5 text-[#938A81]`}
                  >
                    {item.category}
                  </p>
                </div>

                {/* Purchased Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    onTogglePurchased(
                      item.id
                    )
                  }
                  aria-label={
                    item.purchased
                      ? `Mark ${item.name} as pending`
                      : `Mark ${item.name} as purchased`
                  }
                  aria-pressed={
                    item.purchased
                  }
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition active:scale-95 ${
                    item.purchased
                      ? "border-green-600 bg-green-600 text-white shadow-sm"
                      : "border-[#DDD4C8] bg-white text-transparent hover:border-green-300"
                  }`}
                >
                  <Check
                    size={15}
                    strokeWidth={2.4}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 border-t border-[#F0E7DA]">
              <button
                type="button"
                onClick={() =>
                  onEdit(item)
                }
                className={`${typography.button} flex min-h-10 items-center justify-center gap-2 border-r border-[#F0E7DA] text-[#2F6B3C] transition hover:bg-[#F7FBF7] active:bg-green-50`}
              >
                <Pencil
                  size={14}
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
                className={`${typography.button} flex min-h-10 items-center justify-center gap-2 text-red-600 transition hover:bg-red-50/60 active:bg-red-50`}
              >
                <Trash2
                  size={14}
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