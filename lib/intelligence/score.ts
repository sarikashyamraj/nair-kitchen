import {
  DEFAULT_MEAL_SLOT_COUNT,
  KITCHEN_SCORE_WEIGHTS,
  RECIPE_VARIETY_TARGET,
  getKitchenHealthStatus,
} from "./constants";

import type {
  BudgetIntelligenceInput,
  KitchenHealthStatus,
  KitchenIntelligenceInput,
  KitchenScoreBreakdown,
} from "./types";

type KitchenScoreResult = {
  score: number;
  status: KitchenHealthStatus;
  breakdown: KitchenScoreBreakdown;
};

function clampScore(value: number) {
  return Math.min(
    Math.max(Math.round(value), 0),
    100
  );
}

function calculatePantryScore(
  pantry: KitchenIntelligenceInput["pantry"]
) {
  if (pantry.length === 0) {
    return 0;
  }

  const healthyItems = pantry.filter(
    (item) =>
      item.quantity >
      (item.minQuantity ?? 0)
  ).length;

  return clampScore(
    (healthyItems / pantry.length) * 100
  );
}

function calculateGroceryScore(
  shopping: KitchenIntelligenceInput["shopping"]
) {
  if (shopping.length === 0) {
    return 100;
  }

  const purchasedItems =
    shopping.filter(
      (item) => item.purchased
    ).length;

  return clampScore(
    (purchasedItems / shopping.length) *
      100
  );
}

function calculatePlannerScore(
  planner: KitchenIntelligenceInput["planner"],
  currentDate: Date
) {
  const currentDay =
    currentDate.toLocaleDateString(
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

  if (!todaysPlan) {
    return 0;
  }

  const mealSlots = [
    todaysPlan.morningDrink,
    todaysPlan.breakfast,
    todaysPlan.lunch,
    todaysPlan.snack,
    todaysPlan.dinner,
  ];

  const plannedMeals =
    mealSlots.filter(Boolean).length;

  return clampScore(
    (plannedMeals /
      DEFAULT_MEAL_SLOT_COUNT) *
      100
  );
}

function calculateRecipeScore(
  recipes: KitchenIntelligenceInput["recipes"]
) {
  if (recipes.length === 0) {
    return 0;
  }

  return clampScore(
    (recipes.length /
      RECIPE_VARIETY_TARGET) *
      100
  );
}

function calculateBudgetScore(
  budget?: BudgetIntelligenceInput
) {
  if (
    !budget ||
    budget.monthlyBudget <= 0
  ) {
    return 100;
  }

  const usagePercentage =
    (budget.monthlySpent /
      budget.monthlyBudget) *
    100;

  if (usagePercentage <= 70) {
    return 100;
  }

  if (usagePercentage <= 85) {
    return 85;
  }

  if (usagePercentage <= 100) {
    return 65;
  }

  if (usagePercentage <= 120) {
    return 35;
  }

  return 10;
}

export function calculateKitchenScore(
  input: KitchenIntelligenceInput
): KitchenScoreResult {
  const currentDate =
    input.currentDate ?? new Date();

  const breakdown: KitchenScoreBreakdown =
    {
      pantry:
        calculatePantryScore(
          input.pantry
        ),

      grocery:
        calculateGroceryScore(
          input.shopping
        ),

      planner:
        calculatePlannerScore(
          input.planner,
          currentDate
        ),

      recipes:
        calculateRecipeScore(
          input.recipes
        ),

      budget:
        calculateBudgetScore(
          input.budget
        ),
    };

  const weightedScore =
    breakdown.pantry *
      KITCHEN_SCORE_WEIGHTS.pantry +
    breakdown.grocery *
      KITCHEN_SCORE_WEIGHTS.grocery +
    breakdown.planner *
      KITCHEN_SCORE_WEIGHTS.planner +
    breakdown.recipes *
      KITCHEN_SCORE_WEIGHTS.recipes +
    breakdown.budget *
      KITCHEN_SCORE_WEIGHTS.budget;

  const score =
    clampScore(weightedScore);

  return {
    score,
    status:
      getKitchenHealthStatus(score),
    breakdown,
  };
}