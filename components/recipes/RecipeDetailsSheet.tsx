"use client";

import {
  Clock3,
  ShoppingCart,
  Utensils,
} from "lucide-react";

import { Recipe } from "../../types/recipe";

import BottomSheet from "../ui/BottomSheet";

type RecipeDetailsSheetProps = {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToGrocery: (
    recipe: Recipe
  ) => void;
  onEdit: (
    recipe: Recipe
  ) => void;
};

export default function RecipeDetailsSheet({
  recipe,
  isOpen,
  onClose,
  onAddToGrocery,
  onEdit,
}: RecipeDetailsSheetProps) {
  if (!recipe) {
    return null;
  }

  const mealTypes =
    recipe.mealTypes?.length > 0
      ? recipe.mealTypes.join(", ")
      : "Not set";

  return (
    <BottomSheet
  isOpen={isOpen}
  title={recipe.name}
  subtitle="Ingredients and cooking instructions."
  onClose={onClose}
>
      <div className="space-y-5">
        {/* Recipe Summary */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-green-50 px-2.5 py-1 font-medium text-[#2F6B3C]">
            {recipe.category}
          </span>

          <span className="rounded-full bg-[#F7F4EE] px-2.5 py-1 text-[#5A4032]">
            {mealTypes}
          </span>

          {recipe.cookingTime && (
            <span className="flex items-center gap-1 rounded-full bg-[#FFF4D8] px-2.5 py-1 font-medium text-[#9A6500]">
              <Clock3
                size={13}
                strokeWidth={1.9}
              />

              {recipe.cookingTime}
            </span>
          )}
        </div>

        {/* Ingredients */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Utensils
              size={17}
              strokeWidth={1.9}
              className="text-[#2F6B3C]"
            />

            <h3 className="font-bold text-[#2F6B3C]">
              Ingredients
            </h3>

            <span className="text-xs text-gray-500">
              ({recipe.ingredients.length})
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#EADCC4] bg-white">
            {recipe.ingredients.map(
              (ingredient, index) => (
                <div
                  key={`${ingredient.name}-${index}`}
                  className={`flex items-center justify-between gap-4 px-3.5 py-3 ${
                    index <
                    recipe.ingredients.length - 1
                      ? "border-b border-[#F4E8D0]"
                      : ""
                  }`}
                >
                  <span className="min-w-0 flex-1 text-sm font-medium text-[#5A4032]">
                    {ingredient.name}
                  </span>

                  <span className="shrink-0 text-sm font-semibold text-[#2F6B3C]">
                    {ingredient.quantity}{" "}
                    {ingredient.unit}
                  </span>
                </div>
              )
            )}
          </div>
        </section>

        {/* Instructions */}
        <section>
          <h3 className="mb-3 font-bold text-[#2F6B3C]">
            Instructions
          </h3>

          {recipe.instructions.trim() ? (
            <div className="rounded-xl border border-[#EADCC4] bg-[#FCFAF6] p-4">
              <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 text-[#5A4032]">
  {recipe.instructions}
</p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#EADCC4] bg-[#FCFAF6] p-4">
              <p className="text-sm text-gray-500">
                No cooking instructions have
                been added yet.
              </p>
            </div>
          )}
        </section>

        {/* Primary Action */}
        <button
          type="button"
          onClick={() =>
            onAddToGrocery(recipe)
          }
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F6B3C] px-4 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] active:bg-[#245B32]"
        >
          <ShoppingCart
            size={16}
            strokeWidth={1.9}
          />

          Add to Grocery List
        </button>

        {/* Edit Action */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onEdit(recipe);
          }}
          className="min-h-11 w-full rounded-xl border border-[#2F6B3C] bg-white px-4 text-sm font-semibold text-[#2F6B3C] transition active:bg-[#F3F8F4]"
        >
          Edit Recipe
        </button>
      </div>
    </BottomSheet>
  );
}