import { useState } from "react";
import { deleteCloudRecipe } from "../../services/recipeService";
import { Recipe } from "../../types/recipe";
import { addIngredientsToGrocery } from "../../lib/groceryService";
import ConfirmModal from "../common/ConfirmModal";
import { useToast } from "../../context/ToastContext";
import { useKitchen } from "../../context/KitchenContext";
import { saveCloudGroceryItems } from "../../services/groceryService";
import RecipesDesktopTable from "./RecipesDesktopTable";
import RecipesMobileCards from "./RecipesMobileCards";

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
  const { shopping, setShopping } =
  useKitchen();
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function getMealTypesText(recipe: Recipe) {
    const oldRecipe = recipe as Recipe & { mealType?: string };

    if (recipe.mealTypes && recipe.mealTypes.length > 0) {
      return recipe.mealTypes.join(", ");
    }

    return oldRecipe.mealType || "Not set";
  }

  async function handleAddToGrocery(
  recipe: Recipe
) {
  try {
    const mergedGrocery =
      addIngredientsToGrocery(
        shopping,
        recipe.ingredients
      );

    const newItems =
      mergedGrocery.filter(
        (mergedItem) =>
          !shopping.some(
            (existingItem) =>
              existingItem.id ===
              mergedItem.id
          )
      );

    if (newItems.length === 0) {
      showToast({
        type: "info",
        message:
          "All ingredients are already in Grocery.",
      });
      return;
    }

    const savedNewItems =
      await saveCloudGroceryItems(
        newItems
      );

    setShopping((currentItems) => [
      ...currentItems,
      ...savedNewItems,
    ]);

    showToast({
      type: "success",
      message: `"${recipe.name}" ingredients added to Grocery.`,
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to add ingredients to Grocery.",
    });
  }
}

  return (
    <>
      {filteredRecipes.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
          No recipes found.
        </div>
      ) : (
        <>
          <RecipesMobileCards
            recipes={filteredRecipes}
            getMealTypesText={getMealTypesText}
            onAddToGrocery={handleAddToGrocery}
            onEdit={onEdit}
            onDelete={setRecipeToDelete}
          />

          <RecipesDesktopTable
            recipes={filteredRecipes}
            getMealTypesText={getMealTypesText}
            onAddToGrocery={handleAddToGrocery}
            onEdit={onEdit}
            onDelete={setRecipeToDelete}
          />
        </>
      )}

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
        onConfirm={async () => {
  if (!recipeToDelete) return;

  try {
    await deleteCloudRecipe(recipeToDelete.id);

    setRecipes((currentRecipes) =>
      currentRecipes.filter(
        (recipe) =>
          recipe.id !== recipeToDelete.id
      )
    );

    showToast({
      type: "success",
      message: `"${recipeToDelete.name}" deleted successfully.`,
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete recipe.",
    });
  } finally {
    setRecipeToDelete(null);
  }
}}
      />
    </>
  );
}