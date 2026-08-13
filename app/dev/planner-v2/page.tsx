"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addRecipeToCloudPlannedMeal,
  deleteCloudPlannedMeal,
  getOrCreateCloudPlannedMeal,
  getOrCreateCloudWeeklyMealPlan,
  loadCloudWeeklyMealPlan,
  removeRecipeFromCloudPlannedMeal,
  updateCloudPlannedMealStatus,
} from "../../../services/plannerV2Service";

import {
  PlannerMealStatus,
  PlannerMealType,
  WeeklyMealPlan,
} from "../../../types/plannerV2";

import {
  Recipe,
} from "../../../types/recipe";

import {
  useKitchen,
} from "../../../context/KitchenContext";
import {
  analyzeWeeklyPlannerDemand,
} from "../../../lib/planner/plannerDemandAnalyzer";
const TEST_WEEK_START =
  "2026-08-17";

const TEST_MEAL_DATE =
  "2026-08-17";

const TEST_MEAL_TYPE:
  PlannerMealType =
  "lunch";

export default function PlannerV2DevPage() {
  const {
  recipes,
  pantry,
  isKitchenLoaded,
} = useKitchen();

  const [
    plan,
    setPlan,
  ] =
    useState<WeeklyMealPlan | null>(
      null
    );

  const [
    selectedRecipeId,
    setSelectedRecipeId,
  ] =
    useState("");

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const testMeal =
    useMemo(() => {
      if (!plan) {
        return null;
      }

      return (
        plan.meals.find(
          (meal) =>
            meal.mealDate ===
              TEST_MEAL_DATE &&
            meal.mealType ===
              TEST_MEAL_TYPE
        ) || null
      );
    }, [
      plan,
    ]);
const demandAnalysis =
  useMemo(() => {
    if (!plan) {
      return null;
    }

    return analyzeWeeklyPlannerDemand(
      plan,
      pantry
    );
  }, [
    plan,
    pantry,
  ]);
  async function reloadPlan() {
    try {
      setIsLoading(
        true
      );

      setMessage(
        ""
      );

      const loadedPlan =
        await loadCloudWeeklyMealPlan(
          TEST_WEEK_START
        );

      setPlan(
        loadedPlan
      );

      setMessage(
        loadedPlan
          ? "Planner v2 week loaded successfully."
          : "No Planner v2 week exists yet."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load Planner v2."
      );
    } finally {
      setIsLoading(
        false
      );
    }
  }

  useEffect(() => {
    if (
      !isKitchenLoaded
    ) {
      return;
    }

    void reloadPlan();
  }, [
    isKitchenLoaded,
  ]);

  async function handleAddRecipe() {
    if (
      !selectedRecipeId
    ) {
      setMessage(
        "Select a recipe first."
      );

      return;
    }

    try {
      setIsLoading(
        true
      );

      setMessage(
        ""
      );

      /*
       * Week is created only when
       * the first meal is actually
       * added.
       */
      const weeklyPlan =
        await getOrCreateCloudWeeklyMealPlan(
          TEST_WEEK_START
        );

      /*
       * Create or reuse Monday Lunch.
       */
      const meal =
        await getOrCreateCloudPlannedMeal(
          weeklyPlan.id,
          TEST_MEAL_DATE,
          TEST_MEAL_TYPE
        );

      /*
       * Add selected recipe.
       */
      await addRecipeToCloudPlannedMeal(
        meal.id,
        selectedRecipeId
      );

      setSelectedRecipeId(
        ""
      );

      await reloadPlan();

      setMessage(
        "Recipe added to Monday Lunch."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to add recipe."
      );
    } finally {
      setIsLoading(
        false
      );
    }
  }

  async function handleRemoveRecipe(
    recipe: Recipe
  ) {
    if (!testMeal) {
      return;
    }

    try {
      setIsLoading(
        true
      );

      await removeRecipeFromCloudPlannedMeal(
        testMeal.id,
        recipe.id
      );

      const remainingRecipes =
        testMeal.recipes.filter(
          (item) =>
            item.recipeId !==
            recipe.id
        );

      /*
       * Remove the meal slot itself if
       * the last recipe was removed.
       */
      if (
        remainingRecipes.length ===
        0
      ) {
        await deleteCloudPlannedMeal(
          testMeal.id
        );
      }

      await reloadPlan();

      setMessage(
        `${recipe.name} removed from Monday Lunch.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to remove recipe."
      );
    } finally {
      setIsLoading(
        false
      );
    }
  }

  async function handleStatusChange(
    status:
      PlannerMealStatus
  ) {
    if (!testMeal) {
      setMessage(
        "Add at least one recipe before changing meal status."
      );

      return;
    }

    try {
      setIsLoading(
        true
      );

      await updateCloudPlannedMealStatus(
        testMeal.id,
        status
      );

      await reloadPlan();

      setMessage(
        `Monday Lunch status changed to ${status}.`
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update meal status."
      );
    } finally {
      setIsLoading(
        false
      );
    }
  }

  if (!isKitchenLoaded) {
    return (
      <div className="p-6">
        Loading Kitchen Brain...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFDF8] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#B87516]">
            Development Test
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#2F6B3C]">
            Planner v2 Integration
          </h1>

          <p className="mt-2 text-sm text-[#7A746C]">
            Test week:
            {" "}
            17–23 August 2026
          </p>
        </header>

        <section className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
          <h2 className="font-bold text-[#2F6B3C]">
            Monday Lunch
          </h2>

          <p className="mt-1 text-sm text-[#7A746C]">
            Multiple recipes should be allowed in this one meal slot.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              value={
                selectedRecipeId
              }
              onChange={(
                event
              ) =>
                setSelectedRecipeId(
                  event.target.value
                )
              }
              className="min-h-11 flex-1 rounded-xl border border-[#EADCC4] bg-white px-3 text-sm text-[#5A4032]"
            >
              <option value="">
                Select recipe
              </option>

              {recipes.map(
                (recipe) => (
                  <option
                    key={
                      recipe.id
                    }
                    value={
                      recipe.id
                    }
                  >
                    {
                      recipe.name
                    }
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              disabled={
                isLoading
              }
              onClick={
                handleAddRecipe
              }
              className="min-h-11 rounded-xl bg-[#2F6B3C] px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Add Recipe
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {!testMeal ||
            testMeal.recipes.length ===
              0 ? (
              <p className="rounded-xl bg-[#FCFAF6] p-3 text-sm text-[#7A746C]">
                No recipes added yet.
              </p>
            ) : (
              testMeal.recipes.map(
                (
                  item
                ) => (
                  <div
                    key={
                      item.id
                    }
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#EADCC4] bg-[#FCFAF6] px-3 py-2.5"
                  >
                    <div>
                      <p className="font-semibold text-[#245B32]">
                        {
                          item
                            .recipe
                            ?.name ||
                          item.recipeId
                        }
                      </p>

                      <p className="text-xs text-[#7A746C]">
                        Sort order:
                        {" "}
                        {
                          item.sortOrder
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={
                        isLoading
                      }
                      onClick={() => {
                        if (
                          item.recipe
                        ) {
                          void handleRemoveRecipe(
                            item.recipe
                          );
                        }
                      }}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )
              )
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
          <h2 className="font-bold text-[#2F6B3C]">
            Meal Status
          </h2>

          <p className="mt-1 text-sm text-[#7A746C]">
            Current:
            {" "}
            <strong>
              {
                testMeal?.status ||
                "No meal"
              }
            </strong>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                "planned",
                "cooked",
                "ate_out",
                "skipped",
              ] as PlannerMealStatus[]
            ).map(
              (
                status
              ) => (
                <button
                  key={
                    status
                  }
                  type="button"
                  disabled={
                    isLoading ||
                    !testMeal
                  }
                  onClick={() =>
                    void handleStatusChange(
                      status
                    )
                  }
                  className={`min-h-10 rounded-xl border px-3 text-sm font-semibold ${
                    testMeal?.status ===
                    status
                      ? "border-[#2F6B3C] bg-[#EEF7F0] text-[#2F6B3C]"
                      : "border-[#EADCC4] bg-white text-[#5A4032]"
                  } disabled:opacity-40`}
                >
                  {
                    status
                  }
                </button>
              )
            )}
          </div>
        </section>
<section className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
  <h2 className="font-bold text-[#2F6B3C]">
    Weekly Ingredient Demand
  </h2>

  <p className="mt-1 text-sm text-[#7A746C]">
    Remaining Grocery demand from meals
    that are still Planned.
  </p>

  {!demandAnalysis ? (
    <p className="mt-4 rounded-xl bg-[#FCFAF6] p-3 text-sm text-[#7A746C]">
      No weekly plan available.
    </p>
  ) : (
    <>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl bg-[#FCFAF6] p-3">
          <p className="text-xs text-[#7A746C]">
            Ingredients
          </p>

          <p className="mt-1 text-xl font-bold text-[#2F6B3C]">
            {
              demandAnalysis
                .totalIngredients
            }
          </p>
        </div>

        <div className="rounded-xl bg-[#EEF7F0] p-3">
          <p className="text-xs text-[#7A746C]">
            Covered
          </p>

          <p className="mt-1 text-xl font-bold text-[#2F6B3C]">
            {
              demandAnalysis
                .coveredIngredients
            }
          </p>
        </div>

        <div className="rounded-xl bg-[#FFF8EC] p-3">
          <p className="text-xs text-[#7A746C]">
            Need Grocery
          </p>

          <p className="mt-1 text-xl font-bold text-[#B87516]">
            {
              demandAnalysis
                .shortageIngredients
            }
          </p>
        </div>

        <div className="rounded-xl bg-[#FFF4F0] p-3">
          <p className="text-xs text-[#7A746C]">
            Review
          </p>

          <p className="mt-1 text-xl font-bold text-[#A34A2A]">
            {
              demandAnalysis
                .reviewIngredients
            }
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {demandAnalysis
          .ingredientDemands
          .length === 0 ? (
          <p className="rounded-xl bg-[#FCFAF6] p-3 text-sm text-[#7A746C]">
            No remaining ingredient demand.
          </p>
        ) : (
          demandAnalysis
            .ingredientDemands
            .map(
              (item) => (
                <div
                  key={`${item.normalizedName}-${item.unit}`}
                  className="rounded-xl border border-[#EADCC4] bg-[#FCFAF6] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#245B32]">
                        {
                          item.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-[#7A746C]">
                        Required:
                        {" "}
                        {
                          item.requiredQuantity
                        }
                        {" "}
                        {
                          item.unit
                        }
                      </p>

                      <p className="text-xs text-[#7A746C]">
                        Home Inventory:
                        {" "}
                        {
                          item.pantryQuantity
                        }
                        {" "}
                        {
                          item.unit
                        }
                      </p>

                      <p className="text-xs text-[#7A746C]">
                        Grocery shortage:
                        {" "}
                        {
                          item.shortageQuantity
                        }
                        {" "}
                        {
                          item.unit
                        }
                      </p>
                    </div>

                    <span className="rounded-full border border-[#EADCC4] bg-white px-2.5 py-1 text-xs font-semibold uppercase text-[#5A4032]">
                      {
                        item.status
                      }
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#7A746C]">
                    {
                      item.message
                    }
                  </p>

                  {item
                    .sourceRecipeNames
                    .length > 0 && (
                    <p className="mt-2 text-xs font-medium text-[#5A4032]">
                      From:
                      {" "}
                      {item.sourceRecipeNames.join(
                        ", "
                      )}
                    </p>
                  )}
                </div>
              )
            )
        )}
      </div>
    </>
  )}
</section>
        <section className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-[#2F6B3C]">
              Database State
            </h2>
        {/* Weekly Ingredient Demand */}
        <section className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
          <h2 className="font-bold text-[#2F6B3C]">
            Weekly Ingredient Demand
          </h2>

          <p className="mt-1 text-sm text-[#7A746C]">
            Remaining Grocery demand from meals that are still Planned.
          </p>

          {!demandAnalysis ? (
            <p className="mt-4 rounded-xl bg-[#FCFAF6] p-3 text-sm text-[#7A746C]">
              No weekly plan available.
            </p>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-xl bg-[#FCFAF6] p-3">
                  <p className="text-xs text-[#7A746C]">
                    Ingredients
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#2F6B3C]">
                    {demandAnalysis.totalIngredients}
                  </p>
                </div>

                <div className="rounded-xl bg-[#EEF7F0] p-3">
                  <p className="text-xs text-[#7A746C]">
                    Covered
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#2F6B3C]">
                    {demandAnalysis.coveredIngredients}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FFF8EC] p-3">
                  <p className="text-xs text-[#7A746C]">
                    Need Grocery
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#B87516]">
                    {demandAnalysis.shortageIngredients}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FFF4F0] p-3">
                  <p className="text-xs text-[#7A746C]">
                    Review
                  </p>

                  <p className="mt-1 text-xl font-bold text-[#A34A2A]">
                    {demandAnalysis.reviewIngredients}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {demandAnalysis.ingredientDemands.length === 0 ? (
                  <p className="rounded-xl bg-[#FCFAF6] p-3 text-sm text-[#7A746C]">
                    No remaining ingredient demand.
                  </p>
                ) : (
                  demandAnalysis.ingredientDemands.map(
                    (item) => (
                      <div
                        key={`${item.normalizedName}-${item.unit}`}
                        className="rounded-xl border border-[#EADCC4] bg-[#FCFAF6] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#245B32]">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-[#7A746C]">
                              Required:{" "}
                              {item.requiredQuantity}{" "}
                              {item.unit}
                            </p>

                            <p className="text-xs text-[#7A746C]">
                              Home Inventory:{" "}
                              {item.pantryQuantity}{" "}
                              {item.unit}
                            </p>

                            <p className="text-xs text-[#7A746C]">
                              Grocery shortage:{" "}
                              {item.shortageQuantity}{" "}
                              {item.unit}
                            </p>
                          </div>

                          <span className="rounded-full border border-[#EADCC4] bg-white px-2.5 py-1 text-xs font-semibold uppercase text-[#5A4032]">
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-[#7A746C]">
                          {item.message}
                        </p>

                        {item.sourceRecipeNames.length > 0 && (
                          <p className="mt-2 text-xs font-medium text-[#5A4032]">
                            From:{" "}
                            {item.sourceRecipeNames.join(", ")}
                          </p>
                        )}
                      </div>
                    )
                  )
                )}
              </div>
            </>
          )}
        </section>
            <button
              type="button"
              disabled={
                isLoading
              }
              onClick={() =>
                void reloadPlan()
              }
              className="rounded-lg border border-[#2F6B3C] px-3 py-1.5 text-xs font-semibold text-[#2F6B3C]"
            >
              Reload
            </button>
          </div>

          <pre className="mt-4 max-h-80 overflow-auto rounded-xl bg-[#1F2937] p-4 text-xs text-white">
            {JSON.stringify(
              plan,
              null,
              2
            )}
          </pre>
        </section>

        {message && (
          <div className="rounded-xl border border-[#EADCC4] bg-[#FFF8EC] px-4 py-3 text-sm text-[#5A4032]">
            {
              message
            }
          </div>
        )}
      </div>
    </main>
  );
}