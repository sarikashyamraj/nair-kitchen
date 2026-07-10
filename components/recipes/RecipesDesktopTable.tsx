import { Recipe } from "../../types/recipe";

type RecipesDesktopTableProps = {
  recipes: Recipe[];
  getMealTypesText: (recipe: Recipe) => string;
  onAddToGrocery: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
};

export default function RecipesDesktopTable({
  recipes,
  getMealTypesText,
  onAddToGrocery,
  onEdit,
  onDelete,
}: RecipesDesktopTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-4">Recipe</th>
            <th className="p-4">Category</th>
            <th className="p-4">Suitable For</th>
            <th className="p-4">Time</th>
            <th className="p-4">Ingredients</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium">{recipe.name}</td>

              <td className="p-4">{recipe.category}</td>

              <td className="p-4">{getMealTypesText(recipe)}</td>

              <td className="p-4">{recipe.cookingTime}</td>

              <td className="p-4">{recipe.ingredients.length} Items</td>

              <td className="flex gap-2 p-4">
                <button
                  type="button"
                  onClick={() => onAddToGrocery(recipe)}
                  className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                >
                  🛒 Grocery
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(recipe)}
                  className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(recipe)}
                  className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}