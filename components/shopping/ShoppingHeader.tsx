import { INGREDIENT_CATEGORIES } from "../../constants/categories";

interface ShoppingHeaderProps {
  onAdd: () => void;
  onFinishShopping: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

const categories = ["All", ...INGREDIENT_CATEGORIES];

export default function ShoppingHeader({
  onAdd,
  onFinishShopping,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}: ShoppingHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Grocery List</h1>

          <p className="text-gray-500">
            Manage your weekly grocery list efficiently.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onFinishShopping}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
          >
            ✅ Finish Shopping
          </button>

          <button
            onClick={onAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            + Add Item
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Search item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
}