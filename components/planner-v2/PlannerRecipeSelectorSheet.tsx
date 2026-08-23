"use client";

import {
  Check,
  Search,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  Recipe,
} from "../../types/recipe";

import {
  PlannerMealType,
  PLANNER_MEAL_TYPE_LABELS,
} from "../../types/plannerV2";


type PlannerRecipeSelectorSheetProps = {
  isOpen: boolean;

  mealType:
    PlannerMealType;

  recipes:
    Recipe[];

  selectedRecipeIds:
    string[];

  isSaving?: boolean;

  onClose: () => void;

  onConfirm: (
    recipeIds: string[]
  ) => void;
};


export default function PlannerRecipeSelectorSheet({
  isOpen,
  mealType,
  recipes,
  selectedRecipeIds,
  isSaving = false,
  onClose,
  onConfirm,
}: PlannerRecipeSelectorSheetProps) {
  const [
    searchText,
    setSearchText,
  ] =
    useState("");

  const [
    selectedIds,
    setSelectedIds,
  ] =
    useState<
      string[]
    >(
      selectedRecipeIds
    );


  const filteredRecipes =
    useMemo(
      () => {
        const search =
          searchText
            .trim()
            .toLowerCase();

        return recipes
          .filter(
            (recipe) => {
              if (!search) {
                return true;
              }

              return recipe.name
                .toLowerCase()
                .includes(
                  search
                );
            }
          )
          .sort(
            (
              first,
              second
            ) =>
              first.name.localeCompare(
                second.name
              )
          );
      },
      [
        recipes,
        searchText,
      ]
    );


  /*
   * Determine whether the user has
   * actually changed the selection.
   */
  const hasChanges =
    useMemo(
      () => {
        const currentIds =
          [...selectedIds]
            .sort();

        const originalIds =
          [...selectedRecipeIds]
            .sort();

        if (
          currentIds.length !==
          originalIds.length
        ) {
          return true;
        }

        return currentIds.some(
          (
            id,
            index
          ) =>
            id !==
            originalIds[
              index
            ]
        );
      },
      [
        selectedIds,
        selectedRecipeIds,
      ]
    );


  if (!isOpen) {
    return null;
  }


  function toggleRecipe(
    recipeId: string
  ) {
    setSelectedIds(
      (
        current
      ) =>
        current.includes(
          recipeId
        )
          ? current.filter(
              (id) =>
                id !==
                recipeId
            )
          : [
              ...current,
              recipeId,
            ]
    );
  }


  function handleConfirm() {
    onConfirm(
      selectedIds
    );
  }


  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/35">
      <button
        type="button"
        aria-label="Close recipe selector"
        onClick={
          onClose
        }
        className="absolute inset-0"
      />

      <section className="relative z-10 flex max-h-[88vh] w-full max-w-md flex-col rounded-t-[28px] bg-[#FFFDF8] shadow-2xl">

        {/* Drag Handle */}

        <div className="flex justify-center pb-1 pt-3">
          <div className="h-1 w-12 rounded-full bg-[#D7DADF]" />
        </div>


        {/* Header */}

        <div className="flex items-start justify-between gap-3 border-b border-[#F0E4D2] px-5 pb-4 pt-3">
          <div>
            <h2 className="text-lg font-bold text-[#2F6B3C]">
              Manage Recipes
            </h2>

            <p className="mt-1 text-sm text-[#7A746C]">
              {
                PLANNER_MEAL_TYPE_LABELS[
                  mealType
                ]
              }
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#7A746C]"
          >
            <X
              size={18}
            />
          </button>
        </div>


        {/* Search */}

        <div className="px-5 pt-4">
          <div className="flex min-h-11 items-center gap-2 rounded-xl border border-[#EADCC4] bg-white px-3">
            <Search
              size={17}
              className="shrink-0 text-[#9A9188]"
            />

            <input
              value={
                searchText
              }
              onChange={(
                event
              ) =>
                setSearchText(
                  event.target.value
                )
              }
              placeholder="Search recipes..."
              className="min-w-0 flex-1 bg-transparent text-sm text-[#5A4032] outline-none placeholder:text-[#AAA198]"
            />
          </div>
        </div>


        {/* Selection Summary */}

        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <p className="text-sm font-semibold text-[#2F6B3C]">
            Recipes
          </p>

          <p className="text-xs text-[#8A8178]">
            {
              selectedIds.length
            } selected
          </p>
        </div>


        {/* Recipe List */}

        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {filteredRecipes.length ===
          0 ? (
            <div className="rounded-2xl border border-[#EADCC4] bg-white p-6 text-center">
              <p className="text-sm font-semibold text-[#5A4032]">
                No recipes found
              </p>

              <p className="mt-1 text-xs text-[#8A8178]">
                Try another search.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRecipes.map(
                (
                  recipe
                ) => {
                  const isSelected =
                    selectedIds.includes(
                      recipe.id
                    );

                  return (
                    <button
                      key={
                        recipe.id
                      }
                      type="button"
                      onClick={() =>
                        toggleRecipe(
                          recipe.id
                        )
                      }
                      className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition ${
                        isSelected
                          ? "border-[#2F6B3C] bg-[#F3F9F4]"
                          : "border-[#EADCC4] bg-white"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#245B32]">
                          {
                            recipe.name
                          }
                        </p>

                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span className="rounded-full bg-[#F7F4EE] px-2 py-0.5 text-[11px] text-[#7A746C]">
                            {
                              recipe.category
                            }
                          </span>

                          {recipe
                            .cookingTime && (
                            <span className="rounded-full bg-[#FFF8EC] px-2 py-0.5 text-[11px] text-[#B87516]">
                              {
                                recipe.cookingTime
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-[#2F6B3C] bg-[#2F6B3C] text-white"
                            : "border-[#DED6CC] bg-white"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            size={15}
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>


        {/* Footer */}

        <div className="border-t border-[#F0E4D2] bg-white px-5 pb-5 pt-3">
          <button
            type="button"
            onClick={
              handleConfirm
            }
            disabled={
              isSaving ||
              !hasChanges
            }
            className="min-h-12 w-full rounded-xl bg-[#2F6B3C] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSaving
              ? "Saving..."
              : "Save Recipes"}
          </button>

          {selectedIds.length ===
            0 && (
            <p className="mt-2 text-center text-xs text-[#8A8178]">
              Saving with no recipes selected will clear this meal slot.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}