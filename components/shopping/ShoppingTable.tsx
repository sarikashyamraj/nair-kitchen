import { ShoppingItem } from "../../types/shopping";
import { groupShoppingItems } from "../../lib/groupShoppingItems";

interface ShoppingTableProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  onEdit: (item: ShoppingItem) => void;
  searchTerm: string;
  selectedCategory: string;
}

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

export default function ShoppingTable({
  items,
  setItems,
  onEdit,
  searchTerm,
  selectedCategory,
}: ShoppingTableProps) {
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const groupedItems = groupShoppingItems(filteredItems);

  const togglePurchased = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, purchased: !item.purchased }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    if (!confirm("Delete this item?")) return;

    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          No grocery items found.
        </div>
      ) : (
        Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div
            key={category}
            className="bg-white rounded-xl shadow overflow-hidden"
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
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => togglePurchased(item.id)}
                        className="w-5 h-5"
                      />
                    </td>

                    <td
                      className={`p-4 ${
                        item.purchased
                          ? "line-through text-gray-400"
                          : ""
                      }`}
                    >
                      {item.name}
                    </td>

                    <td className="p-4">{item.quantity}</td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}