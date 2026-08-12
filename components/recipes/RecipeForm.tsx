"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  Recipe,
  RecipeIngredient,
  MealType,
} from "../../types/recipe";

import {
  saveCloudRecipe,
} from "../../services/recipeService";

import {
  MEAL_TYPES,
  RECIPE_CATEGORIES,
} from "../../constants/categories";

import {
  UNITS,
} from "../../constants/units";

import {
  useToast,
} from "../../context/ToastContext";

interface RecipeFormProps {
  recipe: Recipe | null;
  recipes: Recipe[];

  setRecipes: React.Dispatch<
    React.SetStateAction<Recipe[]>
  >;

  onClose: () => void;
}

export default function RecipeForm({
  recipe,
  recipes,
  setRecipes,
  onClose,
}: RecipeFormProps) {
  const {
    showToast,
  } = useToast();

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    name,
    setName,
  ] = useState("");

  const [
    category,
    setCategory,
  ] = useState("Vegetarian");

  const [
    mealTypes,
    setMealTypes,
  ] = useState<MealType[]>([
    "Lunch",
  ]);

  const [
    cookingTime,
    setCookingTime,
  ] = useState("");

  const [
    instructions,
    setInstructions,
  ] = useState("");

  const [
    ingredients,
    setIngredients,
  ] = useState<
    RecipeIngredient[]
  >([
    {
      name: "",
      quantity: 1,
      unit: "",
    },
  ]);

  useEffect(() => {
    if (!recipe) {
      return;
    }

    const oldRecipe =
      recipe as Recipe & {
        mealType?: MealType;
      };

    setName(recipe.name);

    setCategory(
      recipe.category
    );

    setMealTypes(
      recipe.mealTypes ||
        [
          oldRecipe.mealType ||
            "Lunch",
        ]
    );

    setCookingTime(
      recipe.cookingTime
    );

    setInstructions(
      recipe.instructions
    );

    setIngredients(
      recipe.ingredients
    );
  }, [recipe]);

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key ===
          "Escape" &&
        !isSaving
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "";
    };
  }, [
    isSaving,
    onClose,
  ]);

  function toggleMealType(
    mealType: MealType
  ) {
    setMealTypes(
      (currentMealTypes) =>
        currentMealTypes.includes(
          mealType
        )
          ? currentMealTypes.filter(
              (type) =>
                type !== mealType
            )
          : [
              ...currentMealTypes,
              mealType,
            ]
    );
  }

  function updateIngredient(
    index: number,
    updates: Partial<RecipeIngredient>
  ) {
    setIngredients(
      (currentIngredients) =>
        currentIngredients.map(
          (
            ingredient,
            ingredientIndex
          ) =>
            ingredientIndex ===
            index
              ? {
                  ...ingredient,
                  ...updates,
                }
              : ingredient
        )
    );
  }

  function removeIngredient(
    index: number
  ) {
    setIngredients(
      (currentIngredients) => {
        if (
          currentIngredients.length ===
          1
        ) {
          return [
            {
              name: "",
              quantity: 1,
              unit: "",
            },
          ];
        }

        return currentIngredients.filter(
          (_, ingredientIndex) =>
            ingredientIndex !==
            index
        );
      }
    );
  }

  function addIngredient() {
    setIngredients(
      (currentIngredients) => [
        ...currentIngredients,
        {
          name: "",
          quantity: 1,
          unit: "",
        },
      ]
    );
  }

  async function handleSave() {
    if (!name.trim()) {
      showToast({
        type: "warning",
        message:
          "Please enter recipe name.",
      });

      return;
    }

    if (
      mealTypes.length === 0
    ) {
      showToast({
        type: "warning",
        message:
          "Please select at least one meal type.",
      });

      return;
    }

    const validIngredients =
      ingredients.filter(
        (ingredient) =>
          ingredient.name.trim() &&
          ingredient.quantity > 0 &&
          ingredient.unit.trim()
      );

    if (
      validIngredients.length === 0
    ) {
      showToast({
        type: "warning",
        message:
          "Please add at least one valid ingredient.",
      });

      return;
    }

    const recipeToSave: Recipe =
      {
        id:
          recipe?.id ||
          crypto.randomUUID(),

        name: name.trim(),

        category,

        mealTypes,

        cookingTime:
          cookingTime.trim(),

        ingredients:
          validIngredients,

        instructions:
          instructions.trim(),
      };

    try {
      setIsSaving(true);

      const savedRecipe =
        await saveCloudRecipe(
          recipeToSave
        );

      setRecipes(
        (currentRecipes) => {
          if (recipe) {
            return currentRecipes.map(
              (
                existingRecipe
              ) =>
                existingRecipe.id ===
                recipe.id
                  ? savedRecipe
                  : existingRecipe
            );
          }

          return [
            ...currentRecipes,
            savedRecipe,
          ];
        }
      );

      showToast({
        type: "success",
        message: recipe
          ? "Recipe updated successfully."
          : "Recipe added successfully.",
      });

      onClose();
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save recipe.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 backdrop-blur-[1px] sm:items-center sm:p-4">
      <div className="flex max-h-[calc(100dvh-0.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-3xl">
        {/* Mobile Drag Handle */}
        <div className="shrink-0 pt-3 sm:hidden">
          <div className="mx-auto h-1.5 w-14 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="shrink-0 border-b border-[#F4E8D0] bg-white px-4 pb-3 pt-3 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#2F6B3C] sm:text-2xl">
                {recipe
                  ? "Edit Recipe"
                  : "Add Recipe"}
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                {recipe
                  ? "Update your recipe details."
                  : "Create a recipe for your kitchen."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close recipe form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-[#F4E8D0] disabled:opacity-50"
            >
              <X
                size={19}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-4 pb-6 sm:px-6 sm:py-5">
          <div className="space-y-5">
            {/* Basic Information */}
            <section className="space-y-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#5A4032]">
                  Recipe Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(
                    event
                  ) =>
                    setName(
                      event.target
                        .value
                    )
                  }
                  placeholder="Chicken Curry"
                  className="min-h-11 w-full rounded-xl border border-[#EADCC4] bg-white px-3.5 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#5A4032]">
                    Category
                  </label>

                  <select
                    value={
                      category
                    }
                    onChange={(
                      event
                    ) =>
                      setCategory(
                        event.target
                          .value
                      )
                    }
                    className="min-h-11 w-full rounded-xl border border-[#EADCC4] bg-white px-3 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
                  >
                    {RECIPE_CATEGORIES.map(
                      (
                        recipeCategory
                      ) => (
                        <option
                          key={
                            recipeCategory
                          }
                          value={
                            recipeCategory
                          }
                        >
                          {
                            recipeCategory
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#5A4032]">
                    Cooking Time
                  </label>

                  <input
                    type="text"
                    value={
                      cookingTime
                    }
                    onChange={(
                      event
                    ) =>
                      setCookingTime(
                        event.target
                          .value
                      )
                    }
                    placeholder="45 mins"
                    className="min-h-11 w-full rounded-xl border border-[#EADCC4] bg-white px-3.5 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
                  />
                </div>
              </div>
            </section>

            {/* Meal Types */}
            <section>
              <h3 className="mb-2 text-sm font-semibold text-[#2F6B3C]">
                Suitable For
              </h3>

              <div className="flex flex-wrap gap-2">
                {MEAL_TYPES.map(
                  (mealType) => {
                    const selected =
                      mealTypes.includes(
                        mealType
                      );

                    return (
                      <button
                        key={
                          mealType
                        }
                        type="button"
                        onClick={() =>
                          toggleMealType(
                            mealType
                          )
                        }
                        aria-pressed={
                          selected
                        }
                        className={`min-h-9 rounded-full border px-3 text-xs font-medium transition ${
                          selected
                            ? "border-[#2F6B3C] bg-[#EEF7F0] text-[#2F6B3C]"
                            : "border-[#EADCC4] bg-white text-[#5A4032]"
                        }`}
                      >
                        {selected
                          ? "✓ "
                          : ""}
                        {mealType}
                      </button>
                    );
                  }
                )}
              </div>
            </section>

            {/* Ingredients */}
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#2F6B3C]">
                    Ingredients
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Add the quantity
                    needed for this
                    recipe.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#F4F8F4] px-2.5 py-1 text-xs font-medium text-[#2F6B3C]">
                  {
                    ingredients.length
                  }{" "}
                  {ingredients.length ===
                  1
                    ? "item"
                    : "items"}
                </span>
              </div>

              <div className="space-y-2.5">
                {ingredients.map(
                  (
                    ingredient,
                    index
                  ) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#EADCC4] bg-[#FFFDF9] p-2.5"
                    >
                      {/* Ingredient Name */}
                      <input
                        type="text"
                        value={
                          ingredient.name
                        }
                        onChange={(
                          event
                        ) =>
                          updateIngredient(
                            index,
                            {
                              name:
                                event
                                  .target
                                  .value,
                            }
                          )
                        }
                        placeholder="Ingredient name"
                        aria-label={`Ingredient ${
                          index + 1
                        } name`}
                        className="min-h-10 w-full rounded-lg border border-[#EADCC4] bg-white px-3 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10"
                      />

                      {/* Quantity / Unit / Delete */}
                      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_42px] gap-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={
  ingredient.quantity === 0
    ? ""
    : ingredient.quantity
}
                          onChange={(
                            event
                          ) =>
                            updateIngredient(
                              index,
                              {
                                quantity:
                                  Number(
                                    event
                                      .target
                                      .value
                                  ),
                              }
                            )
                          }
                          placeholder="Qty"
                          aria-label={`Ingredient ${
                            index + 1
                          } quantity`}
                          className="min-h-10 min-w-0 rounded-lg border border-[#EADCC4] bg-white px-3 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10"
                        />

                        <select
                          value={
                            ingredient.unit
                          }
                          onChange={(
                            event
                          ) =>
                            updateIngredient(
                              index,
                              {
                                unit:
                                  event
                                    .target
                                    .value,
                              }
                            )
                          }
                          aria-label={`Ingredient ${
                            index + 1
                          } unit`}
                          className="min-h-10 min-w-0 rounded-lg border border-[#EADCC4] bg-white px-2.5 text-sm text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/10"
                        >
                          <option value="">
                            Unit
                          </option>

                          {UNITS.map(
                            (unit) => (
                              <option
                                key={
                                  unit
                                }
                                value={
                                  unit
                                }
                              >
                                {unit}
                              </option>
                            )
                          )}
                        </select>

                        <button
                          type="button"
                          onClick={() =>
                            removeIngredient(
                              index
                            )
                          }
                          aria-label={`Remove ${ingredient.name || `ingredient ${index + 1}`}`}
                          className="flex min-h-10 w-[42px] items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition active:bg-red-100"
                        >
                          <Trash2
                            size={16}
                            strokeWidth={
                              1.8
                            }
                          />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={
                  addIngredient
                }
                className="mt-3 flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#D89B3C] bg-[#FFF8E8] px-4 text-sm font-semibold text-[#A86C13] transition active:bg-[#FFF1D1]"
              >
                <Plus
                  size={16}
                  strokeWidth={2}
                />

                Add Ingredient
              </button>
            </section>

            {/* Instructions */}
            <section>
              <label className="mb-2 block font-bold text-[#2F6B3C]">
                Instructions
              </label>

              <textarea
                rows={5}
                value={
                  instructions
                }
                onChange={(
                  event
                ) =>
                  setInstructions(
                    event.target
                      .value
                  )
                }
                placeholder="Write the cooking instructions..."
                spellCheck
                className="
                  w-full
                  resize-y
                  select-text
                  touch-auto
                  rounded-xl
                  border
                  border-[#EADCC4]
                  bg-white
                  px-3.5
                  py-3
                  text-sm
                  leading-6
                  text-[#5A4032]
                  shadow-sm
                  [user-select:text]
                  [-webkit-user-select:text]
                  focus:border-[#2F6B3C]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#2F6B3C]/15
                "
              />
            </section>
          </div>
        </div>

        {/* Fixed Form Actions */}
        <div className="shrink-0 border-t border-[#F4E8D0] bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:px-6 sm:pb-4">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="min-h-11 rounded-xl border border-[#EADCC4] bg-white px-4 text-sm font-semibold text-[#5A4032] transition active:bg-[#FAF8F3] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={isSaving}
              className="min-h-11 rounded-xl bg-[#2F6B3C] px-4 text-sm font-semibold text-white shadow-sm transition active:bg-[#245B32] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving
                ? "Saving..."
                : "Save Recipe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}