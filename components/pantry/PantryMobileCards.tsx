import { PantryItem } from "../../types/pantry";

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
      <div className="md:hidden rounded-2xl border border-[#EADCC4] bg-white p-5 text-center shadow-sm">
        <p className="font-semibold text-[#2F6B3C]">
          No ingredients found
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 md:hidden">
      {items.map((item) => {
        const isOutOfStock = item.quantity === 0;
        const isLowStock =
          !isOutOfStock && item.quantity <= item.minQuantity;

        const status = isOutOfStock
          ? "Out of Stock"
          : isLowStock
          ? "Running Low"
          : "In Stock";

        const statusClass = isOutOfStock
          ? "bg-red-100 text-red-700"
          : isLowStock
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700";

        return (
          <article
            key={item.id}
            className="rounded-xl border border-[#EADCC4] bg-white px-3 py-3 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-[#2F6B3C]">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-[#5A4032]">
                  {item.quantity} {item.unit}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    Available
                  </span>
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass}`}
              >
                {status}
              </span>
            </div>

            <div className="mt-3 flex gap-2 border-t border-[#F4E8D0] pt-3">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="min-h-9 flex-1 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700"
              >
                ✏️ Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="min-h-9 flex-1 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700"
              >
                🗑 Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}