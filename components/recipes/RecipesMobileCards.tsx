import { Recipe } from "../../types/recipe";

type RecipesMobileCardsProps = {
  recipes: Recipe[];
  getMealTypesText: (recipe: Recipe) => string;
  onAddToGrocery: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
};

export default function RecipesMobileCards({
  recipes,
  getMealTypesText,
  onAddToGrocery,
  onEdit,
  onDelete,
}: RecipesMobileCardsProps) {
  return (
    <div className="space-y-3 md:hidden">
      {recipes.map((recipe) => (
        <article
          key={recipe.id}
          className="rounded-xl border border-[#EADCC4] bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-[#2F6B3C]">
                {recipe.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {recipe.category}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#FFF1C7] px-2.5 py-1 text-[11px] font-semibold text-[#8A5A00]">
              {recipe.cookingTime}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-700">
              {getMealTypesText(recipe)}
            </span>

            <span className="rounded-full bg-[#FFF8EC] px-2.5 py-1 text-[#5A4032]">
              {recipe.ingredients.length} ingredients
            </span>
          </div>

          <button
            type="button"
            onClick={() => onAddToGrocery(recipe)}
            className="mt-4 w-full rounded-lg bg-[#2F6B3C] px-3 py-2.5 text-sm font-semibold text-white"
          >
            🛒 Add Ingredients to Grocery
          </button>

          <div className="mt-3 flex gap-2 border-t border-[#F4E8D0] pt-3">
            <button
              type="button"
              onClick={() => onEdit(recipe)}
              className="min-h-9 flex-1 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700"
            >
              ✏️ Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(recipe)}
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