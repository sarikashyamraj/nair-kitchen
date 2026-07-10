import { ShoppingItem } from "../../types/shopping";

type ShoppingMobileCardsProps = {
  items: ShoppingItem[];
  onTogglePurchased: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
};

export default function ShoppingMobileCards({
  items,
  onTogglePurchased,
  onEdit,
  onDelete,
}: ShoppingMobileCardsProps) {
  return (
    <div className="space-y-2 md:hidden">
      {items.map((item) => (
        <article
          key={item.id}
          className={`rounded-xl border bg-white px-3 py-3 shadow-sm ${
            item.purchased
              ? "border-green-200 bg-green-50/40"
              : "border-[#EADCC4]"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.purchased}
              onChange={() => onTogglePurchased(item.id)}
              className="h-6 w-6 shrink-0 accent-[#2F6B3C]"
              aria-label={`Mark ${item.name} as purchased`}
            />

            <div className="min-w-0 flex-1">
              <h3
                className={`truncate text-base font-bold ${
                  item.purchased
                    ? "text-gray-400 line-through"
                    : "text-[#2F6B3C]"
                }`}
              >
                {item.name}
              </h3>

              <p className="mt-1 text-sm text-[#5A4032]">
                {item.quantity}
                <span className="ml-2 text-xs text-gray-500">
                  • {item.category}
                </span>
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                item.purchased
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.purchased ? "Purchased" : "Pending"}
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
      ))}
    </div>
  );
}