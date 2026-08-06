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

type PantryMobileCardsProps = {
  items: PantryItem[];
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
};

function getCategoryIcon(
  category: string
) {
  switch (category) {
    case "Grains":
      return "🌾";

    case "Dairy":
      return "🥛";

    case "Vegetables":
      return "🥬";

    case "Meat":
      return "🍗";

    case "Seafood":
      return "🐟";

    case "Spices":
      return "🌶️";

    case "Snacks":
      return "🍪";

    case "Household":
      return "🧴";

    default:
      return "🥣";
  }
}

export default function PantryMobileCards({
  items,
  onEdit,
  onDelete,
}: PantryMobileCardsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#EADCC4] bg-white p-6 text-center shadow-sm md:hidden">
        <p className="font-bold text-[#2F6B3C]">
          No ingredients found
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          Try another search, category or sort option.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-32 md:hidden">
      {items.map((item) => {
        const status =
          getPantryStockStatus(item);

        const statusLabel =
          getPantryStatusLabel(status);

        const statusClasses =
          getPantryStatusClasses(status);

        const availableClass =
          status === "out_of_stock"
            ? "text-red-700"
            : status === "low_stock"
              ? "text-[#C47A00]"
              : "text-[#245B32]";

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-[#EADCC4] bg-white shadow-sm"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F4E8D0] to-[#FAF8F3] text-3xl">
                  {getCategoryIcon(
                    item.category
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="min-w-0 truncate text-lg font-bold text-[#245B32]">
                      {item.name}
                    </h3>

                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses.badge}`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 divide-x divide-[#F0E7DA]">
                <div className="pr-3">
                  <p className="text-xs text-gray-500">
                    Available
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${availableClass}`}
                  >
                    {item.quantity}{" "}
                    {item.unit}
                  </p>
                </div>

                <div className="px-3">
                  <p className="text-xs text-gray-500">
                    Minimum
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#5A4032]">
                    {item.minQuantity}{" "}
                    {item.unit}
                  </p>
                </div>

                <div className="pl-3">
                  <p className="text-xs text-gray-500">
                    Category
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-[#5A4032]">
                    {item.category}
                  </p>
                </div>
              </div>

              {item.notes && (
                <div className="mt-3 rounded-xl bg-[#FAF8F3] px-3 py-2">
                  <p className="line-clamp-2 text-xs leading-5 text-gray-500">
                    {item.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 border-t border-[#F0E7DA]">
              <button
                type="button"
                onClick={() =>
                  onEdit(item)
                }
                className="flex min-h-12 items-center justify-center gap-2 border-r border-[#F0E7DA] text-sm font-semibold text-[#24663A] transition active:bg-green-50"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(item.id)
                }
                className="flex min-h-12 items-center justify-center gap-2 text-sm font-semibold text-red-600 transition active:bg-red-50"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}