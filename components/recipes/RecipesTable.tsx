"use client";

import {
  useState,
} from "react";

import {
  deleteCloudRecipe,
} from "../../services/recipeService";

import {
  Recipe,
} from "../../types/recipe";

import {
  addIngredientsToGrocery,
} from "../../lib/groceryService";

import ConfirmModal from "../common/ConfirmModal";

import {
  useToast,
} from "../../context/ToastContext";

import {
  useKitchen,
} from "../../context/KitchenContext";

import {
  saveCloudGroceryItems,
} from "../../services/groceryService";

import RecipesDesktopTable from "./RecipesDesktopTable";
import RecipesMobileCards from "./RecipesMobileCards";
import RecipeDetailsSheet from "./RecipeDetailsSheet";

interface RecipesTableProps {
  recipes: Recipe[];

  setRecipes: React.Dispatch<
    React.SetStateAction<Recipe[]>
  >;

  onEdit: (
    recipe: Recipe
  ) => void;

  searchTerm: string;

  selectedCategory: string;

  selectedMealType: string;
}

export default function RecipesTable({
  recipes,
  setRecipes,
  onEdit,
  searchTerm,
  selectedCategory,
  selectedMealType,
}: RecipesTableProps) {
  const {
    showToast,
  } = useToast();

  const {
    shopping,
    setShopping,
  } = useKitchen();

  const [
    recipeToDelete,
    setRecipeToDelete,
  ] = useState<Recipe | null>(
    null
  );

  const [
    selectedRecipe,
    setSelectedRecipe,
  ] = useState<Recipe | null>(
    null
  );

  const filteredRecipes =
    recipes.filter((recipe) => {
      const matchesSearch =
        recipe.name
          .toLowerCase()
          .includes(
            searchTerm
              .trim()
              .toLowerCase()
          );

      const matchesCategory =
        selectedCategory ===
          "All" ||
        recipe.category ===
          selectedCategory;
const matchesMealType =
  selectedMealType === "All" ||
  recipe.mealTypes?.includes(
    selectedMealType as Recipe["mealTypes"][number]
  );
      return (
  matchesSearch &&
  matchesCategory &&
  matchesMealType
);
    });

  function getMealTypesText(
    recipe: Recipe
  ) {
    const oldRecipe =
      recipe as Recipe & {
        mealType?: string;
      };

    if (
      recipe.mealTypes &&
      recipe.mealTypes.length > 0
    ) {
      return recipe.mealTypes.join(
        ", "
      );
    }

    return (
      oldRecipe.mealType ||
      "Not set"
    );
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

      if (
        newItems.length === 0
      ) {
        showToast({
          type: "info",
          message:
            "All ingredients are already in Grocery List.",
        });

        return;
      }

      const savedNewItems =
        await saveCloudGroceryItems(
          newItems
        );

      setShopping(
        (currentItems) => [
          ...currentItems,
          ...savedNewItems,
        ]
      );

      showToast({
        type: "success",
        message: `"${recipe.name}" ingredients added to Grocery List.`,
      });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to add ingredients to Grocery List.",
      });
    }
  }

  function handleOpenRecipe(
    recipe: Recipe
  ) {
    setSelectedRecipe(recipe);
  }

  function handleCloseRecipe() {
    setSelectedRecipe(null);
  }

  function handleEditRecipe(
    recipe: Recipe
  ) {
    setSelectedRecipe(null);
    onEdit(recipe);
  }

  return (
    <>
      {filteredRecipes.length ===
      0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
          No recipes found.
        </div>
      ) : (
        <>
          <RecipesMobileCards
            recipes={
              filteredRecipes
            }
            getMealTypesText={
              getMealTypesText
            }
            onAddToGrocery={
              handleAddToGrocery
            }
            onEdit={
              handleEditRecipe
            }
            onDelete={
              setRecipeToDelete
            }
            onOpen={
              handleOpenRecipe
            }
          />

          <RecipesDesktopTable
            recipes={
              filteredRecipes
            }
            getMealTypesText={
              getMealTypesText
            }
            onAddToGrocery={
              handleAddToGrocery
            }
            onEdit={
              handleEditRecipe
            }
            onDelete={
              setRecipeToDelete
            }
          />
        </>
      )}

      <RecipeDetailsSheet
        recipe={selectedRecipe}
        isOpen={
          selectedRecipe !== null
        }
        onClose={
          handleCloseRecipe
        }
        onAddToGrocery={
          handleAddToGrocery
        }
        onEdit={
          handleEditRecipe
        }
      />

      <ConfirmModal
        isOpen={
          recipeToDelete !== null
        }
        title="Delete Recipe"
        message={
          recipeToDelete
            ? `Are you sure you want to delete "${recipeToDelete.name}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() =>
          setRecipeToDelete(null)
        }
        onConfirm={async () => {
          if (!recipeToDelete) {
            return;
          }

          try {
            await deleteCloudRecipe(
              recipeToDelete.id
            );

            setRecipes(
              (currentRecipes) =>
                currentRecipes.filter(
                  (recipe) =>
                    recipe.id !==
                    recipeToDelete.id
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
            setRecipeToDelete(
              null
            );
          }
        }}
      />
    </>
  );
}