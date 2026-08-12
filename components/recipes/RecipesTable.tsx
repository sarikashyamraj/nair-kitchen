"use client";
import {
  deleteCloudGroceryRequirementSource,
  loadCloudGroceryRequirementSourcesBySource,
  saveCloudGroceryRequirementSource,
  saveCloudGroceryRequirementSources,
} from "../../services/groceryRequirementSourceService";

import {
  GroceryRequirementSource,
} from "../../types/groceryRequirementSource";
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
  ShoppingItem,
} from "../../types/shopping";

import ConfirmModal from "../common/ConfirmModal";

import {
  useToast,
} from "../../context/ToastContext";

import {
  useKitchen,
} from "../../context/KitchenContext";

import {
  saveCloudGroceryItem,
} from "../../services/groceryService";

import {
  analyzeRecipeForGrocery,
  RecipeGroceryAnalysis,
  RecipeIngredientAnalysis,
} from "../../lib/recipes/recipeGroceryAnalyzer";

import RecipesDesktopTable from "./RecipesDesktopTable";
import RecipesMobileCards from "./RecipesMobileCards";
import RecipeDetailsSheet from "./RecipeDetailsSheet";
import RecipeGroceryReviewSheet from "./RecipeGroceryReviewSheet";

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

/* ==========================================
   Grocery Helpers
========================================== */

function normalizeText(
  value: string
) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizeUnit(
  value: string
) {
  const normalized =
    normalizeText(value);

  const aliases:
    Record<string, string> = {
    gram: "g",
    grams: "g",

    kilogram: "kg",
    kilograms: "kg",
    kgs: "kg",

    milliliter: "ml",
    milliliters: "ml",
    millilitre: "ml",
    millilitres: "ml",

    liter: "l",
    liters: "l",
    litre: "l",
    litres: "l",

    piece: "pcs",
    pieces: "pcs",
    pc: "pcs",
    nos: "pcs",
    no: "pcs",

    tablespoon: "tbsp",
    tablespoons: "tbsp",

    teaspoon: "tsp",
    teaspoons: "tsp",
  };

  return (
    aliases[normalized] ??
    normalized
  );
}

function parseShoppingQuantity(
  quantityText: string
) {
  const match =
    quantityText
      .trim()
      .match(
        /^(-?\d+(?:\.\d+)?)\s*(.*)$/
      );

  if (!match) {
    return null;
  }

  const quantity =
    Number(match[1]);

  if (
    !Number.isFinite(
      quantity
    )
  ) {
    return null;
  }

  return {
    quantity,

    unit:
      normalizeUnit(
        match[2] ||
          "pcs"
      ),
  };
}

function formatQuantity(
  quantity: number,
  unit: string
) {
  const rounded =
    Number(
      quantity.toFixed(2)
    );

  return `${rounded} ${unit}`;
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
    pantry,
    shopping,
    setShopping,
  } = useKitchen();

  const [
    recipeToDelete,
    setRecipeToDelete,
  ] =
    useState<Recipe | null>(
      null
    );

  const [
    selectedRecipe,
    setSelectedRecipe,
  ] =
    useState<Recipe | null>(
      null
    );

  const [
    groceryRecipe,
    setGroceryRecipe,
  ] =
    useState<Recipe | null>(
      null
    );

  const [
    groceryAnalysis,
    setGroceryAnalysis,
  ] =
    useState<RecipeGroceryAnalysis | null>(
      null
    );

  const [
    isAddingToGrocery,
    setIsAddingToGrocery,
  ] =
    useState(false);

  /* ==========================================
     Recipe Filtering
  ========================================== */

  const filteredRecipes =
    recipes.filter(
      (recipe) => {
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
          selectedMealType ===
            "All" ||
          recipe.mealTypes?.includes(
            selectedMealType as Recipe["mealTypes"][number]
          );

        return (
          matchesSearch &&
          matchesCategory &&
          matchesMealType
        );
      }
    );

  function getMealTypesText(
    recipe: Recipe
  ) {
    const oldRecipe =
      recipe as Recipe & {
        mealType?: string;
      };

    if (
      recipe.mealTypes &&
      recipe.mealTypes.length >
        0
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

  /* ==========================================
     Recipe Details
  ========================================== */

  function handleOpenRecipe(
    recipe: Recipe
  ) {
    setSelectedRecipe(
      recipe
    );
  }

  function handleCloseRecipe() {
    setSelectedRecipe(
      null
    );
  }

  function handleEditRecipe(
    recipe: Recipe
  ) {
    setSelectedRecipe(
      null
    );

    onEdit(recipe);
  }

  /* ==========================================
     Smart Recipe → Grocery Flow
  ========================================== */

  async function handleCheckIngredients(
  recipe: Recipe
) {
  try {
    const requirementSources =
      await loadCloudGroceryRequirementSourcesBySource(
        "recipe",
        recipe.id
      );

    const analysis =
      analyzeRecipeForGrocery(
        recipe.id,
        recipe.ingredients,
        pantry,
        shopping,
        requirementSources
      );

    setSelectedRecipe(null);

    setGroceryRecipe(
      recipe
    );

    setGroceryAnalysis(
      analysis
    );
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to check recipe ingredients.",
    });
  }
}

  function closeGroceryReview() {
    if (
      isAddingToGrocery
    ) {
      return;
    }

    setGroceryRecipe(
      null
    );

    setGroceryAnalysis(
      null
    );
  }

  async function handleAddSelectedIngredients(
  selectedIngredients:
    RecipeIngredientAnalysis[]
) {
  if (
    selectedIngredients.length ===
    0
  ) {
    return;
  }

  if (!groceryRecipe) {
    showToast({
      type: "error",
      message:
        "Unable to identify the recipe for this Grocery update.",
    });

    return;
  }

  setIsAddingToGrocery(
    true
  );

  try {
    /*
     * Work against a local copy so
     * several selected ingredients
     * can be processed together.
     */
    let nextShopping =
      shopping.map(
        (item) => ({
          ...item,
        })
      );

    /*
     * Grocery rows that need to be
     * inserted or updated.
     */
    const itemsToSave:
      ShoppingItem[] = [];

    /*
     * Recipe → Grocery allocations
     * that need to be persisted.
     */
    const sourceAllocations:
      GroceryRequirementSource[] =
      [];

    for (
      const analysisItem of
      selectedIngredients
    ) {
      const ingredientName =
        analysisItem.ingredient
          .name
          .trim();

      /*
       * Short / Missing:
       * use the calculated shortage.
       *
       * Available item manually
       * selected:
       * user explicitly wants one
       * recipe-sized extra quantity.
       */
      const quantityWanted =
        analysisItem
          .quantityToAdd >
        0
          ? analysisItem
              .quantityToAdd
          : analysisItem
              .requiredQuantity;

      if (
        quantityWanted <= 0
      ) {
        continue;
      }

      const existingIndex =
        nextShopping.findIndex(
          (item) =>
            normalizeText(
              item.name
            ) ===
            normalizeText(
              ingredientName
            )
        );

      /* ======================================
         New Grocery Item
      ====================================== */

      if (
        existingIndex < 0
      ) {
        const newItem:
          ShoppingItem = {
          id:
            crypto.randomUUID(),

          name:
            ingredientName,

          category:
            analysisItem
              .category ||
            "Other",

          quantity:
            formatQuantity(
              quantityWanted,
              analysisItem.unit
            ),

          purchased:
            false,
        };

        nextShopping.push(
          newItem
        );

        itemsToSave.push(
          newItem
        );

        sourceAllocations.push({
          id:
            crypto.randomUUID(),

          groceryItemId:
            newItem.id,

          sourceType:
            "recipe",

          sourceId:
            groceryRecipe.id,

          sourceName:
            groceryRecipe.name,

          ingredientName,

          /*
           * Store the TOTAL allocation
           * currently contributed by
           * this recipe.
           */
          quantity:
            analysisItem
              .allocatedQuantity +
            quantityWanted,

          unit:
            analysisItem.unit,
        });

        continue;
      }

      /* ======================================
         Existing Grocery Item
      ====================================== */

      const existingItem =
        nextShopping[
          existingIndex
        ];

      const parsedExisting =
        parseShoppingQuantity(
          existingItem.quantity
        );

      if (
        !parsedExisting
      ) {
        throw new Error(
          `Unable to read the existing Grocery quantity for ${ingredientName}.`
        );
      }

      const existingUnit =
        normalizeUnit(
          parsedExisting.unit
        );

      const ingredientUnit =
        normalizeUnit(
          analysisItem.unit
        );

      /*
       * We deliberately do not create
       * a duplicate row when units are
       * incompatible.
       */
      if (
        existingUnit !==
        ingredientUnit
      ) {
        throw new Error(
          `${ingredientName} is already in Grocery List as ${existingItem.quantity}. Please review that item before adding ${quantityWanted} ${analysisItem.unit}.`
        );
      }

      const updatedItem:
        ShoppingItem = {
        ...existingItem,

        category:
          analysisItem
            .category ||
          existingItem.category,

        quantity:
          formatQuantity(
            parsedExisting
              .quantity +
              quantityWanted,
            existingUnit
          ),

        purchased:
          false,
      };

      nextShopping[
        existingIndex
      ] = updatedItem;

      /*
       * If this Grocery row was already
       * added to itemsToSave during the
       * same operation, replace that
       * pending version rather than
       * adding another save.
       */
      const saveIndex =
        itemsToSave.findIndex(
          (item) =>
            item.id ===
            updatedItem.id
        );

      if (
        saveIndex >= 0
      ) {
        itemsToSave[
          saveIndex
        ] = updatedItem;
      } else {
        itemsToSave.push(
          updatedItem
        );
      }

      sourceAllocations.push({
        id:
          crypto.randomUUID(),

        groceryItemId:
          updatedItem.id,

        sourceType:
          "recipe",

        sourceId:
          groceryRecipe.id,

        sourceName:
          groceryRecipe.name,

        ingredientName,

        quantity:
          analysisItem
            .allocatedQuantity +
          quantityWanted,

        unit:
          analysisItem.unit,
      });
    }

    /* ======================================
       Nothing to Save
    ====================================== */

    if (
      itemsToSave.length ===
      0
    ) {
      showToast({
        type: "info",
        message:
          "No Grocery List changes were needed.",
      });

      setGroceryRecipe(
        null
      );

      setGroceryAnalysis(
        null
      );

      return;
    }

    /* ======================================
       Save Grocery Rows
    ====================================== */

    const savedItems =
      await Promise.all(
        itemsToSave.map(
          (item) =>
            saveCloudGroceryItem(
              item
            )
        )
      );

    /* ======================================
       Save Recipe Source Allocations
    ====================================== */

    if (
      sourceAllocations.length >
      0
    ) {
      await saveCloudGroceryRequirementSources(
        sourceAllocations
      );
    }

    /*
     * Replace locally-created Grocery
     * objects with the versions returned
     * from Supabase.
     */
    const savedById =
      new Map(
        savedItems.map(
          (item) => [
            item.id,
            item,
          ]
        )
      );

    nextShopping =
      nextShopping.map(
        (item) =>
          savedById.get(
            item.id
          ) ?? item
      );

    setShopping(
      nextShopping
    );

    showToast({
      type: "success",

      message:
        savedItems.length ===
        1
          ? "1 ingredient added or updated in Grocery List."
          : `${savedItems.length} ingredients added or updated in Grocery List.`,
    });

    setGroceryRecipe(
      null
    );

    setGroceryAnalysis(
      null
    );
  } catch (error) {
    showToast({
      type: "error",

      message:
        error instanceof Error
          ? error.message
          : "Unable to update Grocery List.",
    });
  } finally {
    setIsAddingToGrocery(
      false
    );
  }
}
async function handleReduceAllocation(
  analysisItem:
    RecipeIngredientAnalysis
) {
  if (
    !groceryRecipe ||
    analysisItem.quantityToReduce <=
      0
  ) {
    return;
  }

  const groceryItem =
    analysisItem.groceryItem;

  if (!groceryItem) {
    showToast({
      type: "error",
      message:
        "The Grocery item could not be found.",
    });

    return;
  }

  setIsAddingToGrocery(
    true
  );

  try {
    /*
     * Load the allocations belonging
     * only to this recipe.
     */
    const requirementSources =
      await loadCloudGroceryRequirementSourcesBySource(
        "recipe",
        groceryRecipe.id
      );

    const normalizedIngredientName =
      normalizeText(
        analysisItem.ingredient
          .name
      );

    const source =
      requirementSources.find(
        (item) =>
          normalizeText(
            item.ingredientName
          ) ===
          normalizedIngredientName
      );

    if (!source) {
      throw new Error(
        `Unable to find the Grocery allocation for ${analysisItem.ingredient.name}.`
      );
    }

    /*
     * Read current Grocery quantity.
     */
    const parsedGrocery =
      parseShoppingQuantity(
        groceryItem.quantity
      );

    if (!parsedGrocery) {
      throw new Error(
        `Unable to read the Grocery quantity for ${analysisItem.ingredient.name}.`
      );
    }

    const groceryUnit =
      normalizeUnit(
        parsedGrocery.unit
      );

    const ingredientUnit =
      normalizeUnit(
        analysisItem.unit
      );

    if (
      groceryUnit !==
      ingredientUnit
    ) {
      throw new Error(
        `${analysisItem.ingredient.name} is stored in Grocery as ${groceryItem.quantity}. Please review the Grocery item before reducing ${analysisItem.quantityToReduce} ${analysisItem.unit}.`
      );
    }

    /*
     * Reduce only the excess allocated
     * by THIS recipe.
     *
     * Example:
     *
     * Grocery total       17 pcs
     * Lemon Pickle excess  7 pcs
     * New Grocery total   10 pcs
     */
    const newGroceryQuantity =
      parsedGrocery.quantity -
      analysisItem.quantityToReduce;

    if (
      newGroceryQuantity <= 0
    ) {
      throw new Error(
        "This adjustment would reduce the Grocery quantity to zero or below. Please review the Grocery item manually."
      );
    }

    const updatedGroceryItem:
      ShoppingItem = {
      ...groceryItem,

      quantity:
        formatQuantity(
          newGroceryQuantity,
          groceryUnit
        ),
    };

    const savedGroceryItem =
      await saveCloudGroceryItem(
        updatedGroceryItem
      );

    /*
     * Update THIS recipe's source
     * allocation.
     *
     * Example:
     * 15 pcs → 8 pcs
     */
    const newAllocatedQuantity =
      analysisItem
        .allocatedQuantity -
      analysisItem
        .quantityToReduce;

    if (
      newAllocatedQuantity >
      0
    ) {
      await saveCloudGroceryRequirementSource({
        ...source,

        quantity:
          newAllocatedQuantity,

        unit:
          analysisItem.unit,
      });
    } else {
      await deleteCloudGroceryRequirementSource(
        source.id
      );
    }

    /*
     * Update Grocery state locally.
     */
    const nextShopping =
      shopping.map(
        (item) =>
          item.id ===
          savedGroceryItem.id
            ? savedGroceryItem
            : item
      );

    setShopping(
      nextShopping
    );

    /*
     * Re-run the analysis immediately
     * so the sheet stays open and the
     * Review status disappears.
     */
    const updatedSources =
      await loadCloudGroceryRequirementSourcesBySource(
        "recipe",
        groceryRecipe.id
      );

    const updatedAnalysis =
      analyzeRecipeForGrocery(
        groceryRecipe.id,
        groceryRecipe.ingredients,
        pantry,
        nextShopping,
        updatedSources
      );

    setGroceryAnalysis(
      updatedAnalysis
    );

    showToast({
      type: "success",
      message:
        `${analysisItem.ingredient.name} Grocery allocation reduced by ${analysisItem.quantityToReduce} ${analysisItem.unit}.`,
    });
  } catch (error) {
    showToast({
      type: "error",

      message:
        error instanceof Error
          ? error.message
          : "Unable to adjust Grocery allocation.",
    });
  } finally {
    setIsAddingToGrocery(
      false
    );
  }
}
  /* ==========================================
     Render
  ========================================== */

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
              handleCheckIngredients
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
              handleCheckIngredients
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

      {/* Recipe Details */}
      <RecipeDetailsSheet
        recipe={
          selectedRecipe
        }
        isOpen={
          selectedRecipe !==
          null
        }
        onClose={
          handleCloseRecipe
        }
        onAddToGrocery={
          handleCheckIngredients
        }
        onEdit={
          handleEditRecipe
        }
      />

      {/* Smart Grocery Review */}
      <RecipeGroceryReviewSheet
  recipe={
    groceryRecipe
  }
  analysis={
    groceryAnalysis
  }
  isOpen={
    groceryRecipe !==
      null &&
    groceryAnalysis !==
      null
  }
  isSaving={
    isAddingToGrocery
  }
  onClose={
    closeGroceryReview
  }
  onAddSelected={
    handleAddSelectedIngredients
  }
  onReduceAllocation={
    handleReduceAllocation
  }
/>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={
          recipeToDelete !==
          null
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
          setRecipeToDelete(
            null
          )
        }
        onConfirm={async () => {
          if (
            !recipeToDelete
          ) {
            return;
          }

          try {
            await deleteCloudRecipe(
              recipeToDelete.id
            );

            setRecipes(
              (
                currentRecipes
              ) =>
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
                error instanceof
                Error
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