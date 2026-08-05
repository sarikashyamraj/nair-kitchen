import {
  BUDGET_USAGE_THRESHOLDS,
  INSIGHT_PRIORITY,
  MAX_DASHBOARD_INSIGHTS,
} from "./constants";

import {
  getBudgetMessage,
  getGroceryMessage,
  getPantryMessage,
  getPlannerMessage,
  getRecipeMessage,
} from "./messages";

import { calculateKitchenScore } from "./score";

import type {
  KitchenInsight,
  KitchenIntelligenceInput,
  KitchenIntelligenceResult,
} from "./types";

function createPantryInsights(
  input: KitchenIntelligenceInput
): KitchenInsight[] {
  const lowStockItems = input.pantry.filter(
    (item) =>
      item.quantity <=
      (item.minQuantity ?? 0)
  );

  const visibleNames = lowStockItems
    .slice(0, 3)
    .map((item) => item.name);

  const pantryMessage = getPantryMessage({
    totalItems: input.pantry.length,
    lowStockCount: lowStockItems.length,
    visibleNames,
  });

  if (input.pantry.length === 0) {
    return [
      {
        id: "pantry-empty",
        category: "pantry",
        severity: "warning",
        title: pantryMessage.title,
        message: pantryMessage.message,
        priority: INSIGHT_PRIORITY.warning,
        action: {
          label: "Open Pantry",
          href: "/pantry",
        },
      },
    ];
  }

  if (lowStockItems.length === 0) {
    return [
      {
        id: "pantry-healthy",
        category: "pantry",
        severity: "success",
        title: pantryMessage.title,
        message: pantryMessage.message,
        priority: INSIGHT_PRIORITY.success,
        action: {
          label: "View Pantry",
          href: "/pantry",
        },
      },
    ];
  }

  const severity =
    lowStockItems.length >= 5
      ? "critical"
      : "warning";

  return [
    {
      id: "pantry-low-stock",
      category: "pantry",
      severity,
      title: pantryMessage.title,
      message: pantryMessage.message,
      priority:
        severity === "critical"
          ? INSIGHT_PRIORITY.critical
          : INSIGHT_PRIORITY.warning,
      action: {
        label: "Review Pantry",
        href: "/pantry",
      },
      relatedItemIds: lowStockItems.map(
        (item) => item.id
      ),
    },
  ];
}

function createGroceryInsights(
  input: KitchenIntelligenceInput
): KitchenInsight[] {
  const totalItems = input.shopping.length;

  const purchasedItems =
    input.shopping.filter(
      (item) => item.purchased
    ).length;

  const remainingItems =
    totalItems - purchasedItems;

  const completionPercentage =
    totalItems === 0
      ? 0
      : Math.round(
          (purchasedItems / totalItems) *
            100
        );

  const groceryMessage = getGroceryMessage({
    totalItems,
    purchasedItems,
    remainingItems,
    completionPercentage,
  });

  if (totalItems === 0) {
    return [
      {
        id: "grocery-empty",
        category: "grocery",
        severity: "info",
        title: groceryMessage.title,
        message: groceryMessage.message,
        priority: INSIGHT_PRIORITY.info,
        action: {
          label: "Open Grocery",
          href: "/grocery",
        },
      },
    ];
  }

  if (remainingItems === 0) {
    return [
      {
        id: "grocery-complete",
        category: "grocery",
        severity: "success",
        title: groceryMessage.title,
        message: groceryMessage.message,
        priority:
          INSIGHT_PRIORITY.success,
        action: {
          label: "Finish Shopping",
          href: "/grocery",
        },
      },
    ];
  }

  const severity =
    completionPercentage >= 75
      ? "success"
      : "info";

  return [
    {
      id: "grocery-progress",
      category: "grocery",
      severity,
      title: groceryMessage.title,
      message: groceryMessage.message,
      priority:
        severity === "success"
          ? INSIGHT_PRIORITY.success
          : INSIGHT_PRIORITY.info,
      action: {
        label: "Open Grocery",
        href: "/grocery",
      },
      relatedItemIds: input.shopping
        .filter((item) => !item.purchased)
        .map((item) => item.id),
    },
  ];
}

function createPlannerInsights(
  input: KitchenIntelligenceInput
): KitchenInsight[] {
  const currentDate =
    input.currentDate ?? new Date();

  const currentDay =
    currentDate.toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  const todaysPlan = [...input.planner]
    .reverse()
    .find(
      (plan) =>
        plan.day === currentDay
    );

  const mealSlots = todaysPlan
    ? [
        todaysPlan.morningDrink,
        todaysPlan.breakfast,
        todaysPlan.lunch,
        todaysPlan.snack,
        todaysPlan.dinner,
      ]
    : [undefined, undefined, undefined, undefined, undefined];

  const plannedCount =
    mealSlots.filter(Boolean).length;

  const plannerMessage = getPlannerMessage({
    plannedCount,
    totalSlots: mealSlots.length,
    currentDay,
  });

  if (plannedCount === 0) {
    return [
      {
        id: "planner-missing-today",
        category: "planner",
        severity: "warning",
        title: plannerMessage.title,
        message: plannerMessage.message,
        priority:
          INSIGHT_PRIORITY.warning,
        action: {
          label: "Plan Today",
          href: "/planner",
        },
      },
    ];
  }

  if (plannedCount === mealSlots.length) {
    return [
      {
        id: "planner-complete-today",
        category: "planner",
        severity: "success",
        title: plannerMessage.title,
        message: plannerMessage.message,
        priority:
          INSIGHT_PRIORITY.success,
        action: {
          label: "View Planner",
          href: "/planner",
        },
      },
    ];
  }

  return [
    {
      id: "planner-incomplete-today",
      category: "planner",
      severity: "warning",
      title: plannerMessage.title,
      message: plannerMessage.message,
      priority:
        INSIGHT_PRIORITY.warning,
      action: {
        label: "Complete Plan",
        href: "/planner",
      },
    },
  ];
}

function createRecipeInsights(
  input: KitchenIntelligenceInput
): KitchenInsight[] {
  const recipeCount =
    input.recipes.length;

  const recipeMessage = getRecipeMessage({
    recipeCount,
  });

  if (recipeCount === 0) {
    return [
      {
        id: "recipes-empty",
        category: "recipes",
        severity: "warning",
        title: recipeMessage.title,
        message: recipeMessage.message,
        priority:
          INSIGHT_PRIORITY.warning,
        action: {
          label: "Add Recipes",
          href: "/recipes",
        },
      },
    ];
  }

  if (recipeCount < 5) {
    return [
      {
        id: "recipes-low-variety",
        category: "recipes",
        severity: "info",
        title: recipeMessage.title,
        message: recipeMessage.message,
        priority: INSIGHT_PRIORITY.info,
        action: {
          label: "Open Recipes",
          href: "/recipes",
        },
      },
    ];
  }

  return [
    {
      id: "recipes-variety-good",
      category: "recipes",
      severity: "success",
      title: recipeMessage.title,
      message: recipeMessage.message,
      priority:
        INSIGHT_PRIORITY.success,
      action: {
        label: "View Recipes",
        href: "/recipes",
      },
    },
  ];
}

function createBudgetInsights(
  input: KitchenIntelligenceInput
): KitchenInsight[] {
  const budget = input.budget;

  const monthlyBudget =
    budget?.monthlyBudget ?? 0;

  const monthlySpent =
    budget?.monthlySpent ?? 0;

  const currency =
    budget?.currency ?? "AED";

  const usagePercentage =
    monthlyBudget > 0
      ? Math.round(
          (monthlySpent /
            monthlyBudget) *
            100
        )
      : 0;

  const budgetMessage = getBudgetMessage({
    monthlyBudget,
    monthlySpent,
    currency,
    usagePercentage,
  });

  if (monthlyBudget <= 0) {
    return [
      {
        id: "budget-not-set",
        category: "budget",
        severity: "info",
        title: budgetMessage.title,
        message: budgetMessage.message,
        priority: INSIGHT_PRIORITY.info,
        action: {
          label: "Set Budget",
          href: "/budget",
        },
      },
    ];
  }

  if (
    usagePercentage >
    BUDGET_USAGE_THRESHOLDS.critical
  ) {
    return [
      {
        id: "budget-over",
        category: "budget",
        severity: "critical",
        title: budgetMessage.title,
        message: budgetMessage.message,
        priority:
          INSIGHT_PRIORITY.critical,
        action: {
          label: "Review Budget",
          href: "/budget",
        },
      },
    ];
  }

  if (
    usagePercentage >=
    BUDGET_USAGE_THRESHOLDS.warning
  ) {
    return [
      {
        id: "budget-near-limit",
        category: "budget",
        severity: "warning",
        title: budgetMessage.title,
        message: budgetMessage.message,
        priority:
          INSIGHT_PRIORITY.warning,
        action: {
          label: "Review Spending",
          href: "/budget",
        },
      },
    ];
  }

  return [
    {
      id: "budget-healthy",
      category: "budget",
      severity: "success",
      title: budgetMessage.title,
      message: budgetMessage.message,
      priority:
        INSIGHT_PRIORITY.success,
      action: {
        label: "View Budget",
        href: "/budget",
      },
    },
  ];
}

export function analyzeKitchen(
  input: KitchenIntelligenceInput
): KitchenIntelligenceResult {
  const scoreResult =
    calculateKitchenScore(input);

  const insights = [
    ...createPantryInsights(input),
    ...createGroceryInsights(input),
    ...createPlannerInsights(input),
    ...createRecipeInsights(input),
    ...createBudgetInsights(input),
  ]
    .sort(
      (firstInsight, secondInsight) =>
        secondInsight.priority -
        firstInsight.priority
    )
    .slice(
      0,
      MAX_DASHBOARD_INSIGHTS
    );

  return {
    score: scoreResult.score,
    status: scoreResult.status,
    breakdown: scoreResult.breakdown,
    insights,
    generatedAt:
      new Date().toISOString(),
  };
}