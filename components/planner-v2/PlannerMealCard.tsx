"use client";

import {
  Plus,
  Utensils,
} from "lucide-react";

import {
  PlannedMeal,
  PlannerMealStatus,
  PlannerMealType,
  PLANNER_MEAL_STATUS_LABELS,
  PLANNER_MEAL_TYPE_LABELS,
} from "../../types/plannerV2";

type PlannerMealCardProps = {
  mealType:
    PlannerMealType;

  meal:
    PlannedMeal | null;

  onAddRecipes: () => void;

  onChangeStatus: () => void;
};

function getStatusClasses(
  status:
    PlannerMealStatus
) {
  switch (status) {
    case "cooked":
      return "bg-green-50 text-green-700 border-green-200";

    case "ate_out":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "skipped":
      return "bg-gray-100 text-gray-600 border-gray-200";

    default:
      return "bg-[#FFF8EC] text-[#B87516] border-[#F0D7AC]";
  }
}

export default function PlannerMealCard({
  mealType,
  meal,
  onAddRecipes,
  onChangeStatus,
}: PlannerMealCardProps) {
  const status =
    meal?.status ??
    "planned";

  const recipes =
    meal?.recipes ?? [];

  const hasRecipes =
    recipes.length > 0;

  return (
    <article
      className={`rounded-2xl border border-[#EADCC4] bg-white shadow-sm ${
        hasRecipes
          ? "p-4"
          : "px-4 py-3"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8A8178]">
            {
              PLANNER_MEAL_TYPE_LABELS[
                mealType
              ]
            }
          </p>

          {hasRecipes ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {recipes.map(
                (
                  mealRecipe
                ) => (
                  <span
                    key={
                      mealRecipe.id
                    }
                    className="inline-flex items-center rounded-full border border-[#EADCC4] bg-[#FCFAF6] px-2.5 py-1 text-sm font-medium text-[#2F6B3C]"
                  >
                    {
                      mealRecipe
                        .recipe
                        ?.name ??
                      "Recipe"
                    }
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="mt-1 text-sm text-[#A39A90]">
              No recipes planned
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={
            onChangeStatus
          }
          disabled={!meal}
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide transition ${getStatusClasses(
            status
          )} disabled:cursor-not-allowed disabled:opacity-40`}
        >
          {
            PLANNER_MEAL_STATUS_LABELS[
              status
            ]
          }
        </button>
      </div>

      {hasRecipes ? (
        <div className="mt-4 flex items-center gap-2 border-t border-[#F2E7D7] pt-3">
          <button
            type="button"
            onClick={
              onAddRecipes
            }
            className="flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#2F6B3C] bg-white px-3 text-sm font-semibold text-[#2F6B3C] transition active:bg-[#F3F8F4]"
          >
            <Plus
              size={16}
              strokeWidth={2}
            />

            Add Another
          </button>

          <div className="flex h-10 items-center gap-1.5 rounded-xl bg-[#F7F4EE] px-3 text-xs font-medium text-[#7A746C]">
            <Utensils
              size={14}
              strokeWidth={1.9}
            />

            {
              recipes.length
            }
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={
            onAddRecipes
          }
          className="mt-3 flex min-h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#D9E6DB] bg-[#F8FBF8] px-3 text-sm font-semibold text-[#2F6B3C] transition active:bg-[#EEF6EF]"
        >
          <Plus
            size={15}
            strokeWidth={2}
          />

          Add Recipe
        </button>
      )}
    </article>
  );
}