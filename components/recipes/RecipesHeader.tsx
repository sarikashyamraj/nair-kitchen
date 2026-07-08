interface RecipesHeaderProps {
  onAdd: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
}

const categories = [
  "All",
  "Vegetarian",
  "Non-Veg",
  "Vegan",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
];

export default function RecipesHeader({
  onAdd,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}: RecipesHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            🍳 Recipes
          </h1>

          <p className="text-gray-500">
            Manage your family's favourite recipes.
          </p>
        </div>

        <button
          onClick={onAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          + Add Recipe
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Search recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="border rounded-lg px-4 py-2"
        >
          {categories.map((category) => (
            <option key={category}>
              {category}
            </option>
          ))}
        </select>

      </div>

    </div>
  );
}