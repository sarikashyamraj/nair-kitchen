"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  MinusCircle,
  PackageX,
  ShoppingCart,
} from "lucide-react";

import BottomSheet from "../ui/BottomSheet";

import {
  Recipe,
} from "../../types/recipe";

import {
  RecipeGroceryAnalysis,
  RecipeIngredientAnalysis,
} from "../../lib/recipes/recipeGroceryAnalyzer";

type RecipeGroceryReviewSheetProps = {
  recipe: Recipe | null;

  analysis: RecipeGroceryAnalysis | null;

  isOpen: boolean;

  onClose: () => void;

  onAddSelected: (
    selectedIngredients:
      RecipeIngredientAnalysis[]
  ) => Promise<void>;

  onReduceAllocation: (
    ingredient:
      RecipeIngredientAnalysis
  ) => Promise<void>;

  isSaving?: boolean;
};

export default function RecipeGroceryReviewSheet({
  recipe,
  analysis,
  isOpen,
  onClose,
  onAddSelected,
  onReduceAllocation,
  isSaving = false,
}: RecipeGroceryReviewSheetProps) {
  const [
    selectedIndexes,
    setSelectedIndexes,
  ] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (
      !isOpen ||
      !analysis
    ) {
      return;
    }

    const defaultSelected =
      new Set<number>();

    analysis.ingredients.forEach(
      (
        ingredient,
        index
      ) => {
        if (
          ingredient.selectedByDefault
        ) {
          defaultSelected.add(
            index
          );
        }
      }
    );

    setSelectedIndexes(
      defaultSelected
    );
  }, [
    isOpen,
    analysis,
  ]);

  const selectedIngredients =
    useMemo(() => {
      if (!analysis) {
        return [];
      }

      return analysis.ingredients.filter(
        (_, index) =>
          selectedIndexes.has(
            index
          )
      );
    }, [
      analysis,
      selectedIndexes,
    ]);

  const reviewReductionCount =
    useMemo(() => {
      if (!analysis) {
        return 0;
      }

      return analysis.ingredients.filter(
        (item) =>
          item.quantityToReduce >
          0
      ).length;
    }, [
      analysis,
    ]);

  if (
    !recipe ||
    !analysis
  ) {
    return null;
  }

  function toggleIngredient(
    index: number
  ) {
    setSelectedIndexes(
      (
        currentSelection
      ) => {
        const nextSelection =
          new Set(
            currentSelection
          );

        if (
          nextSelection.has(
            index
          )
        ) {
          nextSelection.delete(
            index
          );
        } else {
          nextSelection.add(
            index
          );
        }

        return nextSelection;
      }
    );
  }

  function getStatusPresentation(
    item:
      RecipeIngredientAnalysis
  ) {
    switch (item.status) {
      case "available":
        return {
          icon:
            CheckCircle2,

          iconClass:
            "bg-green-100 text-green-700",

          label:
            "Available",

          labelClass:
            "bg-green-50 text-green-700",
        };

      case "short":
        return {
          icon:
            AlertTriangle,

          iconClass:
            "bg-amber-100 text-[#B87516]",

          label:
            "Short",

          labelClass:
            "bg-amber-50 text-[#B87516]",
        };

      case "missing":
        return {
          icon:
            PackageX,

          iconClass:
            "bg-red-100 text-red-600",

          label:
            "Missing",

          labelClass:
            "bg-red-50 text-red-600",
        };

      case "grocery_covered":
        return {
          icon:
            ShoppingCart,

          iconClass:
            "bg-blue-100 text-blue-700",

          label:
            "In Grocery",

          labelClass:
            "bg-blue-50 text-blue-700",
        };

      case "needs_review":
      default:
        return {
          icon:
            CircleHelp,

          iconClass:
            "bg-purple-100 text-purple-700",

          label:
            "Review",

          labelClass:
            "bg-purple-50 text-purple-700",
        };
    }
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      title="Check Ingredients"
      subtitle={`Review what you need for ${recipe.name}.`}
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* Summary */}
        <section className="rounded-2xl border border-[#E8DED1] bg-[#FCFAF6] p-3">
          <div className="grid grid-cols-5 gap-1.5 text-center">
            <div>
              <p className="text-lg font-bold text-green-700">
                {
                  analysis.availableCount
                }
              </p>

              <p className="text-[10px] text-[#7A746C]">
                Available
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-[#B87516]">
                {
                  analysis.shortCount
                }
              </p>

              <p className="text-[10px] text-[#7A746C]">
                Short
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-red-600">
                {
                  analysis.missingCount
                }
              </p>

              <p className="text-[10px] text-[#7A746C]">
                Missing
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-blue-700">
                {
                  analysis.groceryCoveredCount
                }
              </p>

              <p className="text-[10px] text-[#7A746C]">
                Grocery
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-purple-700">
                {
                  analysis.needsReviewCount
                }
              </p>

              <p className="text-[10px] text-[#7A746C]">
                Review
              </p>
            </div>
          </div>
        </section>

        {/* Ingredient Review */}
        <section>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="font-bold text-[#2F6B3C]">
              Ingredients
            </h3>

            <span className="text-xs text-[#7A746C]">
              {
                selectedIngredients.length
              }{" "}
              selected
            </span>
          </div>

          <div className="space-y-2.5">
            {analysis.ingredients.map(
              (
                item,
                index
              ) => {
                const {
                  icon:
                    StatusIcon,
                  iconClass,
                  label,
                  labelClass,
                } =
                  getStatusPresentation(
                    item
                  );

                const isSelected =
                  selectedIndexes.has(
                    index
                  );

                const isReductionReview =
                  item.quantityToReduce >
                  0;

                /*
                 * Grocery-covered items
                 * cannot be re-added.
                 *
                 * Reduction Review items
                 * use their own dedicated
                 * Reduce Grocery action.
                 */
                const canSelect =
                  item.status !==
                    "grocery_covered" &&
                  !isReductionReview;

                return (
                  <article
                    key={`${item.ingredient.name}-${index}`}
                    className={`rounded-2xl border p-3 transition ${
                      isSelected
                        ? "border-[#2F6B3C] bg-[#F7FBF7]"
                        : isReductionReview
                          ? "border-purple-200 bg-purple-50/30"
                          : "border-[#E8DED1] bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Status */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}
                      >
                        <StatusIcon
                          size={17}
                          strokeWidth={
                            1.9
                          }
                        />
                      </div>

                      {/* Ingredient */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-[#245B32]">
                            {
                              item
                                .ingredient
                                .name
                            }
                          </h4>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${labelClass}`}
                          >
                            {
                              label
                            }
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-[#5A4032]">
                          Recipe needs{" "}
                          <span className="font-semibold">
                            {
                              item.requiredQuantity
                            }{" "}
                            {
                              item.unit
                            }
                          </span>
                        </p>

                        {/* Add Recommendation */}
                        {item.quantityToAdd >
                          0 && (
                          <p className="mt-0.5 text-sm font-semibold text-[#B87516]">
                            Add{" "}
                            {
                              item
                                .ingredient
                                .name
                            }{" "}
                            to Grocery List
                          </p>
                        )}

                        {/* Reduction Recommendation */}
                        {isReductionReview && (
                          <p className="mt-0.5 text-sm font-semibold text-purple-700">
                            Reduce Grocery by{" "}
                            {
                              item.quantityToReduce
                            }{" "}
                            {
                              item.unit
                            }
                          </p>
                        )}

                        <p className="mt-1 text-xs leading-5 text-[#7A746C]">
                          {
                            item.message
                          }
                        </p>

                        {/* Explicit Reduce Action */}
                        {isReductionReview && (
                          <button
                            type="button"
                            disabled={
                              isSaving
                            }
                            onClick={() =>
                              void onReduceAllocation(
                                item
                              )
                            }
                            className="mt-3 flex min-h-9 w-full items-center justify-center gap-2 rounded-xl border border-purple-300 bg-white px-3 text-xs font-semibold text-purple-700 transition active:scale-[0.99] active:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <MinusCircle
                              size={
                                15
                              }
                              strokeWidth={
                                1.9
                              }
                            />

                            Reduce Grocery by{" "}
                            {
                              item.quantityToReduce
                            }{" "}
                            {
                              item.unit
                            }
                          </button>
                        )}
                      </div>

                      {/* Selection */}
                      {!isReductionReview && (
                        <button
                          type="button"
                          disabled={
                            !canSelect ||
                            isSaving
                          }
                          onClick={() =>
                            toggleIngredient(
                              index
                            )
                          }
                          aria-label={
                            isSelected
                              ? `Remove ${item.ingredient.name} from selection`
                              : `Select ${item.ingredient.name}`
                          }
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${
                            !canSelect
                              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300"
                              : isSelected
                                ? "border-[#2F6B3C] bg-[#2F6B3C] text-white"
                                : "border-[#D8D0C6] bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </section>

        {/* Explanation */}
        <div className="rounded-xl border border-[#EADCC4] bg-[#FFF8EC] px-3 py-2.5">
          <p className="text-xs leading-5 text-[#7A746C]">
            Kitchen Brain checks Home Inventory and existing recipe allocations before changing Grocery. Review items are never reduced automatically.
          </p>
        </div>

        {/* Add Selected */}
        <button
          type="button"
          disabled={
            selectedIngredients.length ===
              0 ||
            isSaving
          }
          onClick={() =>
            void onAddSelected(
              selectedIngredients
            )
          }
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2F6B3C] px-4 text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] active:bg-[#245B32] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart
            size={16}
            strokeWidth={
              1.9
            }
          />

          {isSaving
            ? "Updating..."
            : selectedIngredients.length >
                0
              ? selectedIngredients.length ===
                1
                ? "Add 1 Item to Grocery List"
                : `Add ${selectedIngredients.length} Items to Grocery List`
              : reviewReductionCount >
                  0
                ? "Review Changes Above"
                : "Nothing Needed"}
        </button>
      </div>
    </BottomSheet>
  );
}