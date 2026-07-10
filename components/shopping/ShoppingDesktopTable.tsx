import { ShoppingItem } from "../../types/shopping";
import { groupShoppingItems } from "../../lib/groupShoppingItems";

type ShoppingDesktopTableProps = {
  items: ShoppingItem[];
  onTogglePurchased: (id: string) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
};

const categoryIcons: Record<string, string> = {
  Vegetables: "🥬",
  Fruits: "🍎",
  Grains: "🌾",
  Dairy: "🥛",
  Meat: "🥩",
  Seafood: "🐟",
  Spices: "🧂",
  Beverages: "🥤",
  Snacks: "🍿",
  Frozen: "❄️",
  Bakery: "🍞",
  Household: "🧼",
  Grocery: "🛒",
  Other: "📦",
};

export default function ShoppingDesktopTable({
  items,
  onTogglePurchased,
  onEdit,
  onDelete,
}: ShoppingDesktopTableProps) {
  const groupedItems = groupShoppingItems(items);

  return (
    <div className="hidden space-y-6 md:block">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div
          key={category}
          className="overflow-hidden rounded-xl bg-white shadow"
        >
          <div className="bg-[#F4E8D0] px-5 py-3 font-bold text-[#5A4032]">
            {categoryIcons[category] || "📦"} {category}
          </div>

          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-4">Done</th>
                <th className="p-4">Item</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categoryItems.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={item.purchased}
                      onChange={() => onTogglePurchased(item.id)}
                      className="h-5 w-5"
                    />
                  </td>

                  <td
                    className={`p-4 ${
                      item.purchased ? "text-gray-400 line-through" : ""
                    }`}
                  >
                    {item.name}
                  </td>

                  <td className="p-4">{item.quantity}</td>

                  <td className="flex gap-2 p-4">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}