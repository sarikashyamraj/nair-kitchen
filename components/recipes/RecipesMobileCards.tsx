"use client";

import {
  ClipboardCheck,
  Clock3,
  Pencil,
  Trash2,
  Utensils,
} from "lucide-react";

import { Recipe } from "../../types/recipe";

import {
  typography,
} from "../../lib/theme/typography";

type RecipesMobileCardsProps = {
  recipes: Recipe[];
onOpen: (
  recipe: Recipe
) => void;
  getMealTypesText: (
    recipe: Recipe
  ) => string;

  onAddToGrocery: (
    recipe: Recipe
  ) => void;

  onEdit: (
    recipe: Recipe
  ) => void;

  onDelete: (
    recipe: Recipe
  ) => void;
};

export default function RecipesMobileCards({
  recipes,
  getMealTypesText,
  onAddToGrocery,
  onEdit,
  onDelete,
  onOpen,
}: RecipesMobileCardsProps) {
  return (
    <div className="space-y-3 pb-32 md:hidden">
      {recipes.map(
        (recipe) => {
          const mealTypes =
            getMealTypesText(
              recipe
            );

          return (
            <article
              key={recipe.id}
              className="overflow-hidden rounded-2xl border border-[#E8DED1] bg-white shadow-sm"
            >
              {/* Recipe Information */}
<div
  className="cursor-pointer p-3.5"
  role="button"
  tabIndex={0}
  onClick={() =>
    onOpen(recipe)
  }
  onKeyDown={(event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onOpen(recipe);
    }
  }}
>
                {/* Name + Cooking Time */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`${typography.itemTitle} truncate text-[#1F5A33]`}
                    >
                      {recipe.name}
                    </h3>

                    {/* Category + Meal Type */}
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`${typography.caption} text-[#7A746C]`}
                      >
                        {recipe.category}
                      </span>

                      <span
                        aria-hidden="true"
                        className="text-[10px] text-[#C9BFB4]"
                      >
                        •
                      </span>

                      <span
                        className={`${typography.caption} text-[#2F6B3C]`}
                      >
                        {mealTypes}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFF4D8] px-2 py-1 text-[#9A6500]">
                    <Clock3
                      size={12}
                      strokeWidth={
                        1.9
                      }
                    />

                    <span
                      className={`${typography.badge} whitespace-nowrap`}
                    >
                      {
                        recipe.cookingTime
                      }
                    </span>
                  </div>
                </div>

                {/* Ingredient Count */}
                <div className="mt-2 flex items-center gap-1.5 text-[#8A8178]">
                  <Utensils
                    size={13}
                    strokeWidth={
                      1.8
                    }
                  />

                  <span
                    className={
                      typography.caption
                    }
                  >
                    {
                      recipe
                        .ingredients
                        .length
                    }{" "}
                    {recipe
                      .ingredients
                      .length === 1
                      ? "ingredient"
                      : "ingredients"}
                  </span>
                </div>

                {/* Grocery List Action */}
                <button
                  type="button"
                  onClick={(event) => {
  event.stopPropagation();

  onAddToGrocery(
    recipe
  );
}}
                  className={`${typography.button} mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2F6B3C] px-3 text-white shadow-sm transition active:scale-[0.99] active:bg-[#245B32]`}
                >
                  <ClipboardCheck
  size={15}
  strokeWidth={1.9}
/>

                  <span>
                    Check Ingredients
                  </span>
                </button>
              </div>

              {/* Edit / Delete */}
              <div className="grid grid-cols-2 border-t border-[#F0E7DA]">
                <button
                  type="button"
                  onClick={() =>
                    onEdit(recipe)
                  }
                  className={`${typography.button} flex min-h-10 items-center justify-center gap-2 border-r border-[#F0E7DA] text-[#2F6B3C] transition hover:bg-[#F7FBF7] active:bg-green-50`}
                >
                  <Pencil
                    size={14}
                    strokeWidth={
                      1.9
                    }
                  />

                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onDelete(recipe)
                  }
                  className={`${typography.button} flex min-h-10 items-center justify-center gap-2 text-red-600 transition hover:bg-red-50/60 active:bg-red-50`}
                >
                  <Trash2
                    size={14}
                    strokeWidth={
                      1.9
                    }
                  />

                  Delete
                </button>
              </div>
            </article>
          );
        }
      )}
    </div>
  );
}