import { useState } from "react";
import { Recipe } from "../../types/recipe";
import { addIngredientsToGrocery } from "../../lib/groceryService";
import ConfirmModal from "../common/ConfirmModal";
import { useToast } from "../../context/ToastContext";

interface RecipesTableProps {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  onEdit: (recipe: Recipe) => void;
  searchTerm: string;
  selectedCategory: string;
}

export default function RecipesTable({
  recipes,
  setRecipes,
  onEdit,
  searchTerm,
  selectedCategory,
}: RecipesTableProps) {
  const { showToast } = useToast();

  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getMealTypesText = (recipe: Recipe) => {
    const oldRecipe = recipe as Recipe & { mealType?: string };

    if (recipe.mealTypes && recipe.mealTypes.length > 0) {
      return recipe.mealTypes.join(", ");
    }

    return oldRecipe.mealType || "Not set";
  };

  const handleAddToGrocery = (recipe: Recipe) => {
    addIngredientsToGrocery(recipe.ingredients);

    showToast({
      type: "success",
      message: `"${recipe.name}" ingredients added to Grocery.`,
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow overflow-hidden">
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
            {filteredRecipes.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No recipes found.
                </td>
              </tr>
            ) : (
              filteredRecipes.map((recipe) => (
                <tr key={recipe.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{recipe.name}</td>

                  <td className="p-4">{recipe.category}</td>

                  <td className="p-4">{getMealTypesText(recipe)}</td>

                  <td className="p-4">{recipe.cookingTime}</td>

                  <td className="p-4">{recipe.ingredients.length} Items</td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleAddToGrocery(recipe)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      🛒 Grocery
                    </button>

                    <button
                      onClick={() => onEdit(recipe)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => setRecipeToDelete(recipe)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={recipeToDelete !== null}
        title="Delete Recipe"
        message={
          recipeToDelete
            ? `Are you sure you want to delete "${recipeToDelete.name}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setRecipeToDelete(null)}
        onConfirm={() => {
          if (recipeToDelete) {
            setRecipes(
              recipes.filter((recipe) => recipe.id !== recipeToDelete.id)
            );

            showToast({
              type: "success",
              message: `"${recipeToDelete.name}" deleted successfully.`,
            });
          }

          setRecipeToDelete(null);
        }}
      />
    </>
  );
}