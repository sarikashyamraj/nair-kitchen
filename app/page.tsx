"use client";

import { useEffect, useState } from "react";

import AppLayout from "../components/AppLayout";
import BudgetOverview from "../components/dashboard/BudgetOverview";
import GroceryProgress from "../components/dashboard/GroceryProgress";
import KitchenSnapshot from "../components/dashboard/KitchenSnapshot";
import PantryAlerts from "../components/dashboard/PantryAlerts";
import QuickActions from "../components/dashboard/QuickActions";
import TodayMealsTimeline from "../components/dashboard/TodayMealsTimeline";
import { KBIcons } from "../components/icons/KBIcons";

import { useKitchen } from "../context/KitchenContext";
import { loadPreferences } from "../lib/preferencesStorage";

import {
  loadCloudBudgets,
  loadCloudTransactions,
} from "../services/budgetService";

type LastShoppingProgress = {
  totalItems: number;
  purchasedItems: number;
  remainingItems: number;
  completedAt: string;
};

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

export default function Home() {
  const {
    pantry,
    shopping,
    planner,
    recipes,
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

  /*
   * Load the current monthly budget
   * and grocery transactions.
   *
   * This no longer blocks the entire Dashboard.
   * Only BudgetOverview shows its loading state.
   */
  useEffect(() => {
    let isMounted = true;

    async function refreshBudgetSummary() {
      if (isMounted) {
        setIsBudgetLoaded(false);
      }

      try {
        const currentMonth = getMonthKey(
          new Date()
        );

        const preferences =
          loadPreferences();

        const [
          budgets,
          transactions,
        ] = await Promise.all([
          loadCloudBudgets(),
          loadCloudTransactions(),
        ]);

        if (!isMounted) {
          return;
        }

        const currentBudget =
          budgets.find(
            (budget) =>
              budget.month === currentMonth
          );

        const currentMonthSpent =
          transactions
            .filter((transaction) =>
              transaction.date.startsWith(
                currentMonth
              )
            )
            .reduce(
              (total, transaction) =>
                total +
                transaction.amount,
              0
            );

        setMonthlyBudget(
          currentBudget?.amount || 0
        );

        setMonthlySpent(
          currentMonthSpent
        );

        setBudgetCurrency(
          preferences.currency
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
   * Pantry information
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
   * Current grocery-list information
   */
  const groceryPurchased =
    shopping.filter(
      (item) => item.purchased
    ).length;

  /*
   * Use active grocery-list progress while
   * the user is currently checking items.
   *
   * After purchased items are removed during
   * Finish Shopping, use the saved session
   * progress when its remaining count matches
   * the current grocery list.
   */
  const shouldUseLastShoppingProgress =
    groceryPurchased === 0 &&
    lastShoppingProgress !== null &&
    shopping.length ===
      lastShoppingProgress.remainingItems;

  const groceryProgressTotal =
    shouldUseLastShoppingProgress
      ? lastShoppingProgress.totalItems
      : shopping.length;

  const groceryProgressPurchased =
    shouldUseLastShoppingProgress
      ? lastShoppingProgress.purchasedItems
      : groceryPurchased;

  const groceryProgressRemaining =
    Math.max(
      groceryProgressTotal -
        groceryProgressPurchased,
      0
    );

  /*
   * Today's meal information
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

  const mealsPlanned =
    mealSlots.filter((meal) =>
      Boolean(meal.recipeId)
    ).length;

  /*
   * Kitchen score
   */
  const groceryCompletion =
    groceryProgressTotal === 0
      ? 100
      : Math.round(
          (groceryProgressPurchased /
            groceryProgressTotal) *
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

  return (
    <AppLayout>
      <div className="space-y-6 lg:space-y-8">
        <KitchenSnapshot
          pantryItems={
            totalPantryItems
          }
          groceryRemaining={
            groceryProgressRemaining
          }
          recipesSaved={
            recipes.length
          }
          mealsPlanned={
            mealsPlanned
          }
          kitchenScore={
            kitchenScore
          }
        />

        <TodayMealsTimeline
          meals={mealSlots.map(
            (meal) => {
              const Icon =
                meal.icon;

              return {
                icon: (
                  <Icon
                    size={20}
                    strokeWidth={2.1}
                  />
                ),
                title: meal.title,
                recipeName:
                  getRecipeName(
                    meal.recipeId
                  ),
                isPlanned: Boolean(
                  meal.recipeId
                ),
              };
            }
          )}
          plannedCount={
            mealsPlanned
          }
          totalCount={
            mealSlots.length
          }
        />

        <PantryAlerts
          items={lowStockPantryItems.map(
            (item) => ({
              id: item.id,
              name: item.name,
              quantity:
                item.quantity,
              unit: item.unit,
            })
          )}
        />

        <GroceryProgress
          totalItems={
            groceryProgressTotal
          }
          purchasedItems={
            groceryProgressPurchased
          }
        />

        <BudgetOverview
          monthlyBudget={
            monthlyBudget
          }
          monthlySpent={
            monthlySpent
          }
          currency={
            budgetCurrency
          }
          isLoading={
            !isBudgetLoaded
          }
          error={
            budgetLoadError
          }
        />

        <QuickActions />
      </div>
    </AppLayout>
  );
}