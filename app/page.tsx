"use client";

import {
  useEffect,
  useState,
} from "react";

import AppLayout from "../components/AppLayout";
import BudgetOverview from "../components/dashboard/BudgetOverview";
import GroceryProgress from "../components/dashboard/GroceryProgress";
import KitchenIntelligence from "../components/dashboard/KitchenIntelligence";
import KitchenSnapshot from "../components/dashboard/KitchenSnapshot";
import PantryAlerts from "../components/dashboard/PantryAlerts";
import QuickActions from "../components/dashboard/QuickActions";
import TodayMealsTimeline from "../components/dashboard/TodayMealsTimeline";

import { KBIcons } from "../components/icons/KBIcons";

import { useKitchen } from "../context/KitchenContext";

import {
  DashboardCacheData,
  loadDashboardCache,
  saveDashboardCache,
} from "../lib/dashboardCache";

import { loadPreferences } from "../lib/preferencesStorage";

import { loadDashboardBudgetSummary } from "../services/dashboardBudgetService";

type LastShoppingProgress = {
  totalItems: number;
  purchasedItems: number;
  remainingItems: number;
  completedAt: string;
};

export default function Home() {
  const {
    pantry,
    shopping,
    planner,
    recipes,
    isKitchenLoaded,
  } = useKitchen();

  const [monthlyBudget, setMonthlyBudget] =
    useState(0);

  const [monthlySpent, setMonthlySpent] =
    useState(0);

  const [budgetCurrency, setBudgetCurrency] =
    useState("AED");

  const [isBudgetLoaded, setIsBudgetLoaded] =
    useState(false);

  const [budgetLoadError, setBudgetLoadError] =
    useState("");

  const [
    lastShoppingProgress,
    setLastShoppingProgress,
  ] = useState<LastShoppingProgress | null>(
    null
  );

  const [
    cachedDashboard,
    setCachedDashboard,
  ] = useState<DashboardCacheData | null>(
    null
  );

  /*
   * Load the most recent Dashboard cache.
   *
   * This allows the last known Dashboard values
   * to display immediately while cloud data
   * refreshes in the background.
   */
  useEffect(() => {
    setCachedDashboard(
      loadDashboardCache()
    );
  }, []);

  /*
   * Load only the current month’s Budget summary.
   *
   * The optimized service fetches:
   * - One current-month budget record
   * - Current-month transaction amounts only
   */
  useEffect(() => {
    let isMounted = true;

    async function refreshBudgetSummary() {
      if (isMounted) {
        setIsBudgetLoaded(false);
      }

      try {
        const preferences =
          loadPreferences();

        const budgetSummary =
          await loadDashboardBudgetSummary(
            preferences.currency
          );

        if (!isMounted) {
          return;
        }

        setMonthlyBudget(
          budgetSummary.monthlyBudget
        );

        setMonthlySpent(
          budgetSummary.monthlySpent
        );

        setBudgetCurrency(
          budgetSummary.currency
        );

        setBudgetLoadError("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setBudgetLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard budget."
        );
      } finally {
        if (isMounted) {
          setIsBudgetLoaded(true);
        }
      }
    }

    function handleBudgetUpdated() {
      void refreshBudgetSummary();
    }

    function handlePreferencesUpdated() {
      void refreshBudgetSummary();
    }

    void refreshBudgetSummary();

    window.addEventListener(
      "budget-updated",
      handleBudgetUpdated
    );

    window.addEventListener(
      "preferences-updated",
      handlePreferencesUpdated
    );

    return () => {
      isMounted = false;

      window.removeEventListener(
        "budget-updated",
        handleBudgetUpdated
      );

      window.removeEventListener(
        "preferences-updated",
        handlePreferencesUpdated
      );
    };
  }, []);

  /*
   * Load the progress from the most recently
   * completed shopping session.
   */
  useEffect(() => {
    function refreshShoppingProgress() {
      const savedProgress =
        localStorage.getItem(
          "kitchen-brain-last-shopping-progress"
        );

      if (!savedProgress) {
        setLastShoppingProgress(null);
        return;
      }

      try {
        const parsedProgress =
          JSON.parse(
            savedProgress
          ) as LastShoppingProgress;

        const isValidProgress =
          typeof parsedProgress.totalItems ===
          "number" &&
          typeof parsedProgress.purchasedItems ===
          "number" &&
          typeof parsedProgress.remainingItems ===
          "number" &&
          typeof parsedProgress.completedAt ===
          "string";

        if (!isValidProgress) {
          throw new Error(
            "Invalid saved shopping progress."
          );
        }

        setLastShoppingProgress(
          parsedProgress
        );
      } catch {
        localStorage.removeItem(
          "kitchen-brain-last-shopping-progress"
        );

        setLastShoppingProgress(null);
      }
    }

    refreshShoppingProgress();

    window.addEventListener(
      "grocery-updated",
      refreshShoppingProgress
    );

    return () => {
      window.removeEventListener(
        "grocery-updated",
        refreshShoppingProgress
      );
    };
  }, []);

  const currentDay =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  const todaysPlan = [...planner]
    .reverse()
    .find(
      (plan) =>
        plan.day === currentDay
    );

  function getRecipeName(
    recipeId?: string
  ) {
    if (!recipeId) {
      return "Not planned";
    }

    const recipe = recipes.find(
      (item) =>
        item.id === recipeId
    );

    return (
      recipe?.name || "Not planned"
    );
  }

  /*
   * Live Pantry information
   */
  const totalPantryItems =
    pantry.length;

  const lowStockPantryItems =
    pantry.filter(
      (item) =>
        item.quantity <=
        (item.minQuantity ?? 0)
    );

  const lowStockItems =
    lowStockPantryItems.length;

  const pantryHealth =
    totalPantryItems === 0
      ? 0
      : Math.round(
        ((totalPantryItems -
          lowStockItems) /
          totalPantryItems) *
        100
      );

  /*
   * Live Grocery information
   */
  const groceryPurchased =
    shopping.filter(
      (item) => item.purchased
    ).length;

  const shouldUseLastShoppingProgress =
    groceryPurchased === 0 &&
    lastShoppingProgress !== null &&
    shopping.length ===
    lastShoppingProgress.remainingItems;

  const liveGroceryProgressTotal =
    shouldUseLastShoppingProgress
      ? lastShoppingProgress.totalItems
      : shopping.length;

  const liveGroceryProgressPurchased =
    shouldUseLastShoppingProgress
      ? lastShoppingProgress.purchasedItems
      : groceryPurchased;

  const liveGroceryProgressRemaining =
    Math.max(
      liveGroceryProgressTotal -
      liveGroceryProgressPurchased,
      0
    );

  /*
   * Live Meal information
   */
  const mealSlots = [
    {
      icon:
        KBIcons.meals.morningDrink,
      title: "Morning Drink",
      recipeId:
        todaysPlan?.morningDrink,
    },
    {
      icon:
        KBIcons.meals.breakfast,
      title: "Breakfast",
      recipeId:
        todaysPlan?.breakfast,
    },
    {
      icon:
        KBIcons.meals.lunch,
      title: "Lunch",
      recipeId:
        todaysPlan?.lunch,
    },
    {
      icon:
        KBIcons.meals.snack,
      title: "Snack",
      recipeId:
        todaysPlan?.snack,
    },
    {
      icon:
        KBIcons.meals.dinner,
      title: "Dinner",
      recipeId:
        todaysPlan?.dinner,
    },
  ];

  const liveMeals =
    mealSlots.map((meal) => ({
      title: meal.title,
      recipeName:
        getRecipeName(
          meal.recipeId
        ),
      isPlanned: Boolean(
        meal.recipeId
      ),
    }));

  const mealsPlanned =
    liveMeals.filter(
      (meal) => meal.isPlanned
    ).length;

  /*
   * Live Kitchen Score
   */
  const groceryCompletion =
    liveGroceryProgressTotal === 0
      ? 100
      : Math.round(
        (liveGroceryProgressPurchased /
          liveGroceryProgressTotal) *
        100
      );

  const plannerCompletion =
    mealSlots.length === 0
      ? 0
      : Math.round(
        (mealsPlanned /
          mealSlots.length) *
        100
      );

  const kitchenScore = Math.round(
    pantryHealth * 0.5 +
    groceryCompletion * 0.25 +
    plannerCompletion * 0.25
  );

  /*
   * Use cached Kitchen data only while current
   * cloud Kitchen data is still loading.
   */
  const useCachedKitchenData =
    !isKitchenLoaded &&
    cachedDashboard !== null;

  const displayedPantryItems =
    useCachedKitchenData
      ? cachedDashboard.pantryItems
      : totalPantryItems;

  const displayedGroceryRemaining =
    useCachedKitchenData
      ? cachedDashboard.groceryRemaining
      : liveGroceryProgressRemaining;

  const displayedRecipesSaved =
    useCachedKitchenData
      ? cachedDashboard.recipesSaved
      : recipes.length;

  const displayedMealsPlanned =
    useCachedKitchenData
      ? cachedDashboard.mealsPlanned
      : mealsPlanned;

  const displayedKitchenScore =
    useCachedKitchenData
      ? cachedDashboard.kitchenScore
      : kitchenScore;

  const displayedLowStockItems =
    useCachedKitchenData
      ? cachedDashboard.lowStockItems
      : lowStockPantryItems.map(
        (item) => ({
          id: item.id,
          name: item.name,
          quantity:
            item.quantity,
          unit: item.unit,
        })
      );

  const displayedGroceryTotal =
    useCachedKitchenData
      ? cachedDashboard
        .groceryProgressTotal
      : liveGroceryProgressTotal;

  const displayedGroceryPurchased =
    useCachedKitchenData
      ? cachedDashboard
        .groceryProgressPurchased
      : liveGroceryProgressPurchased;

  const displayedMeals =
    useCachedKitchenData
      ? cachedDashboard.meals
      : liveMeals;

  /*
   * Use cached Budget data while the cloud Budget
   * request is loading or temporarily unavailable.
   */
  const useCachedBudgetData =
    cachedDashboard !== null &&
    (!isBudgetLoaded ||
      Boolean(budgetLoadError));

  const displayedMonthlyBudget =
    useCachedBudgetData
      ? cachedDashboard.monthlyBudget
      : monthlyBudget;

  const displayedMonthlySpent =
    useCachedBudgetData
      ? cachedDashboard.monthlySpent
      : monthlySpent;

  const displayedBudgetCurrency =
    useCachedBudgetData
      ? cachedDashboard.budgetCurrency
      : budgetCurrency;

  /*
   * Save a fresh Dashboard cache once Kitchen
   * and current-month Budget data have loaded.
   */
  useEffect(() => {
    if (
      !isKitchenLoaded ||
      !isBudgetLoaded ||
      budgetLoadError
    ) {
      return;
    }

    const dashboardCacheData: DashboardCacheData =
    {
      pantryItems:
        totalPantryItems,

      groceryRemaining:
        liveGroceryProgressRemaining,

      recipesSaved:
        recipes.length,

      mealsPlanned,

      kitchenScore,

      groceryProgressTotal:
        liveGroceryProgressTotal,

      groceryProgressPurchased:
        liveGroceryProgressPurchased,

      lowStockItems:
        lowStockPantryItems.map(
          (item) => ({
            id: item.id,
            name: item.name,
            quantity:
              item.quantity,
            unit: item.unit,
          })
        ),

      meals: liveMeals,

      monthlyBudget,
      monthlySpent,
      budgetCurrency,
    };

    saveDashboardCache(
      dashboardCacheData
    );

    setCachedDashboard(
      dashboardCacheData
    );
  }, [
    isKitchenLoaded,
    isBudgetLoaded,
    budgetLoadError,
    pantry,
    shopping,
    planner,
    recipes,
    lastShoppingProgress,
    monthlyBudget,
    monthlySpent,
    budgetCurrency,
  ]);

  return (
    <AppLayout showGreeting>
      <div className="space-y-6 lg:space-y-8">
        <KitchenSnapshot
          pantryItems={
            displayedPantryItems
          }
          groceryRemaining={
            displayedGroceryRemaining
          }
          recipesSaved={
            displayedRecipesSaved
          }
          mealsPlanned={
            displayedMealsPlanned
          }
          kitchenScore={
            displayedKitchenScore
          }
        />
        <KitchenIntelligence
          monthlyBudget={displayedMonthlyBudget}
          monthlySpent={displayedMonthlySpent}
          currency={displayedBudgetCurrency}
        />
        <TodayMealsTimeline
          meals={displayedMeals.map(
            (meal) => {
              const matchedSlot =
                mealSlots.find(
                  (slot) =>
                    slot.title ===
                    meal.title
                );

              const Icon =
                matchedSlot?.icon ??
                KBIcons.meals.breakfast;

              return {
                icon: (
                  <Icon
                    size={20}
                    strokeWidth={2.1}
                  />
                ),
                title: meal.title,
                recipeName:
                  meal.recipeName,
                isPlanned:
                  meal.isPlanned,
              };
            }
          )}
          plannedCount={
            displayedMealsPlanned
          }
          totalCount={
            displayedMeals.length
          }
        />

        <PantryAlerts
          items={
            displayedLowStockItems
          }
        />

        <GroceryProgress
          totalItems={
            displayedGroceryTotal
          }
          purchasedItems={
            displayedGroceryPurchased
          }
        />

        <BudgetOverview
          monthlyBudget={
            displayedMonthlyBudget
          }
          monthlySpent={
            displayedMonthlySpent
          }
          currency={
            displayedBudgetCurrency
          }
          isLoading={
            !isBudgetLoaded &&
            !cachedDashboard
          }
          error={
            cachedDashboard
              ? ""
              : budgetLoadError
          }
        />

        <QuickActions />
      </div>
    </AppLayout>
  );
}