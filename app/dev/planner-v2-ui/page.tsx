"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AppLayout from "../../../components/AppLayout";

import PlannerWeekHeader from "../../../components/planner-v2/PlannerWeekHeader";
import PlannerDayTabs from "../../../components/planner-v2/PlannerDayTabs";
import PlannerMealCard from "../../../components/planner-v2/PlannerMealCard";
import PlannerRecipeSelectorSheet from "../../../components/planner-v2/PlannerRecipeSelectorSheet";
import {
  addRecipeToCloudPlannedMeal,
  getOrCreateCloudPlannedMeal,
  getOrCreateCloudWeeklyMealPlan,
  loadCloudWeeklyMealPlan,
  removeRecipeFromCloudPlannedMeal,
} from "../../../services/plannerV2Service";

import {
  PlannedMeal,
  PLANNER_MEAL_TYPES,
  PlannerMealType,
  WeeklyMealPlan,
} from "../../../types/plannerV2";

import {
  useKitchen,
} from "../../../context/KitchenContext";


/* ============================================================
   Date Helpers
============================================================ */

function formatIsoDate(
  date: Date
) {
  return [
    date.getFullYear(),

    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    ),

    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    ),
  ].join("-");
}


function getMondayForDate(
  date: Date
) {
  const result =
    new Date(
      date
    );

  const day =
    result.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  result.setDate(
    result.getDate() +
      difference
  );

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}


function addDays(
  dateText: string,
  numberOfDays: number
) {
  const date =
    new Date(
      `${dateText}T00:00:00`
    );

  date.setDate(
    date.getDate() +
      numberOfDays
  );

  return formatIsoDate(
    date
  );
}


function formatSelectedDay(
  dateText: string
) {
  const date =
    new Date(
      `${dateText}T00:00:00`
    );

  const weekday =
    date
      .toLocaleDateString(
        "en-GB",
        {
          weekday:
            "long",
        }
      )
      .toUpperCase();

  const dateLabel =
    date
      .toLocaleDateString(
        "en-GB",
        {
          day:
            "numeric",

          month:
            "short",
        }
      )
      .toUpperCase();

  return `${weekday} · ${dateLabel}`;
}


/* ============================================================
   Page
============================================================ */

export default function PlannerV2UIPage() {
  const {
  recipes,
  isKitchenLoaded,
} =
  useKitchen();


  /*
   * Start with the real current week.
   */
  const initialWeekStart =
    useMemo(
      () =>
        formatIsoDate(
          getMondayForDate(
            new Date()
          )
        ),
      []
    );


  const [
    weekStartDate,
    setWeekStartDate,
  ] =
    useState(
      initialWeekStart
    );


  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState(
      initialWeekStart
    );


  const [
    plan,
    setPlan,
  ] =
    useState<
      WeeklyMealPlan | null
    >(
      null
    );


  const [
    isLoading,
    setIsLoading,
  ] =
    useState(
      true
    );


  const [
    message,
    setMessage,
  ] =
    useState(
      ""
    );
const [
  recipeSelectorMealType,
  setRecipeSelectorMealType,
] =
  useState<
    PlannerMealType | null
  >(
    null
  );

const [
  isSavingRecipes,
  setIsSavingRecipes,
] =
  useState(
    false
  );

  /* ==========================================================
     Load Selected Week
  ========================================================== */

  useEffect(() => {
    if (
      !isKitchenLoaded
    ) {
      return;
    }


    async function loadWeek() {
      try {
        setIsLoading(
          true
        );

        setMessage(
          ""
        );


        const loadedPlan =
          await loadCloudWeeklyMealPlan(
            weekStartDate
          );


        setPlan(
          loadedPlan
        );
      } catch (
        error
      ) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load Weekly Planner."
        );
      } finally {
        setIsLoading(
          false
        );
      }
    }


    void loadWeek();
  }, [
    isKitchenLoaded,
    weekStartDate,
  ]);


  /* ==========================================================
     Meals For Selected Day
  ========================================================== */

  const mealsForSelectedDay =
    useMemo(
      () => {
        const mealMap =
          new Map<
            PlannerMealType,
            PlannedMeal
          >();


        if (!plan) {
          return mealMap;
        }


        plan.meals
          .filter(
            (meal) =>
              meal.mealDate ===
              selectedDate
          )
          .forEach(
            (meal) => {
              mealMap.set(
                meal.mealType,
                meal
              );
            }
          );


        return mealMap;
      },
      [
        plan,
        selectedDate,
      ]
    );


  /* ==========================================================
     Week Navigation
  ========================================================== */

  function handlePreviousWeek() {
    const previousWeek =
      addDays(
        weekStartDate,
        -7
      );


    setWeekStartDate(
      previousWeek
    );


    setSelectedDate(
      previousWeek
    );
  }


  function handleNextWeek() {
    const nextWeek =
      addDays(
        weekStartDate,
        7
      );


    setWeekStartDate(
      nextWeek
    );


    setSelectedDate(
      nextWeek
    );
  }


  /* ==========================================================
     Temporary UI Handlers

     These become real bottom sheets
     in the next stage.
  ========================================================== */

  function handleAddRecipes(
  mealType:
    PlannerMealType
) {
  setRecipeSelectorMealType(
    mealType
  );

  setMessage(
    ""
  );
}


  function handleChangeStatus(
    mealType:
      PlannerMealType
  ) {
    const meal =
      mealsForSelectedDay.get(
        mealType
      );


    if (!meal) {
      return;
    }


    setMessage(
      `Status selector for ${mealType} will open here.`
    );
  }


  /* ==========================================================
     Loading
  ========================================================== */

  if (
    !isKitchenLoaded
  ) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="font-semibold text-[#2F6B3C]">
            Loading Weekly Planner...
          </p>
        </div>
      </AppLayout>
    );
  }


  /* ==========================================================
     UI
  ========================================================== */

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-4 pb-32 md:pb-8">

        {/* Week Header */}

        <PlannerWeekHeader
          weekStartDate={
            weekStartDate
          }
          onPreviousWeek={
            handlePreviousWeek
          }
          onNextWeek={
            handleNextWeek
          }
        />


        {/* Day Selector */}

        <PlannerDayTabs
          weekStartDate={
            weekStartDate
          }
          selectedDate={
            selectedDate
          }
          onSelectDate={
            setSelectedDate
          }
        />


        {/* Selected Day */}

        <section className="px-1 pt-1">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#B87516]">
            {
              formatSelectedDay(
                selectedDate
              )
            }
          </p>

          <p className="mt-1 text-sm text-[#7A746C]">
            Plan the meals you intend
            to prepare for this day.
          </p>
        </section>


        {/* Loading Selected Week */}

        {isLoading ? (
          <div className="rounded-2xl border border-[#EADCC4] bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-medium text-[#2F6B3C]">
              Loading meals...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {PLANNER_MEAL_TYPES.map(
              (
                mealType
              ) => {
                const meal =
                  mealsForSelectedDay.get(
                    mealType
                  ) ??
                  null;


                return (
                  <PlannerMealCard
                    key={
                      mealType
                    }
                    mealType={
                      mealType
                    }
                    meal={
                      meal
                    }
                    onAddRecipes={() =>
                      handleAddRecipes(
                        mealType
                      )
                    }
                    onChangeStatus={() =>
                      handleChangeStatus(
                        mealType
                      )
                    }
                  />
                );
              }
            )}
          </div>
        )}


        {/* Grocery Summary Placeholder */}

        <section className="rounded-2xl border border-[#D8E5D9] bg-[#F4FAF5] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7A746C]">
            Weekly Grocery Requirements
          </p>

          <h2 className="mt-1 text-lg font-bold text-[#2F6B3C]">
            Plan your week first
          </h2>

          <p className="mt-1 text-sm leading-5 text-[#7A746C]">
            Kitchen Brain will compare
            your planned recipes with
            Home Inventory and show only
            the Grocery changes you need.
          </p>

          <button
            type="button"
            disabled
            className="mt-4 min-h-11 w-full rounded-xl bg-[#2F6B3C] px-4 text-sm font-semibold text-white opacity-50"
          >
            Review Grocery Needs
          </button>
        </section>


        {/* Temporary Development Message */}

        {message && (
          <div className="rounded-xl border border-[#EADCC4] bg-[#FFF8EC] px-4 py-3 text-sm text-[#5A4032]">
            {
              message
            }
          </div>
        )}
        {recipeSelectorMealType && (
  <PlannerRecipeSelectorSheet
    isOpen={
      true
    }
    mealType={
      recipeSelectorMealType
    }
    recipes={
      recipes
    }
    selectedRecipeIds={
      mealsForSelectedDay
        .get(
          recipeSelectorMealType
        )
        ?.recipes.map(
          (item) =>
            item.recipeId
        ) ?? []
    }
    isSaving={
      isSavingRecipes
    }
    onClose={() =>
      setRecipeSelectorMealType(
        null
      )
    }
    onConfirm={async (
  recipeIds
) => {
  try {
    setIsSavingRecipes(
      true
    );

    const weeklyPlan =
      await getOrCreateCloudWeeklyMealPlan(
        weekStartDate
      );

    const existingMeal =
      mealsForSelectedDay.get(
        recipeSelectorMealType
      );

    /*
     * If the user cleared all recipes
     * from a meal that already exists,
     * remove the existing recipe links.
     *
     * We do not need to create a new
     * meal slot when zero recipes are
     * selected.
     */
    if (
      recipeIds.length ===
        0 &&
      existingMeal
    ) {
      for (
        const existingRecipe of
        existingMeal.recipes
      ) {
        await removeRecipeFromCloudPlannedMeal(
          existingMeal.id,
          existingRecipe.recipeId
        );
      }

      const refreshedPlan =
        await loadCloudWeeklyMealPlan(
          weekStartDate
        );

      setPlan(
        refreshedPlan
      );

      setRecipeSelectorMealType(
        null
      );

      setMessage(
        "Meal recipes updated."
      );

      return;
    }

    /*
     * Nothing selected and no existing
     * meal means there is nothing to do.
     */
    if (
      recipeIds.length ===
        0 &&
      !existingMeal
    ) {
      setRecipeSelectorMealType(
        null
      );

      return;
    }

    const meal =
      existingMeal ??
      await getOrCreateCloudPlannedMeal(
        weeklyPlan.id,
        selectedDate,
        recipeSelectorMealType
      );

    const existingRecipeIds =
      meal.recipes.map(
        (item) =>
          item.recipeId
      );

    /*
     * Recipes newly selected.
     */
    const recipeIdsToAdd =
      recipeIds.filter(
        (recipeId) =>
          !existingRecipeIds.includes(
            recipeId
          )
      );

    /*
     * Recipes that existed before but
     * have now been deselected.
     */
    const recipeIdsToRemove =
      existingRecipeIds.filter(
        (recipeId) =>
          !recipeIds.includes(
            recipeId
          )
      );

    for (
      const recipeId of
      recipeIdsToAdd
    ) {
      await addRecipeToCloudPlannedMeal(
        meal.id,
        recipeId
      );
    }

    for (
      const recipeId of
      recipeIdsToRemove
    ) {
      await removeRecipeFromCloudPlannedMeal(
        meal.id,
        recipeId
      );
    }

    const refreshedPlan =
      await loadCloudWeeklyMealPlan(
        weekStartDate
      );

    setPlan(
      refreshedPlan
    );

    setRecipeSelectorMealType(
      null
    );

    setMessage(
      "Meal recipes updated."
    );
  } catch (
    error
  ) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Unable to update meal recipes."
    );
    } finally {
    setIsSavingRecipes(
      false
    );
  }
}}
/>
)}

    </div>
  </AppLayout>
);
}