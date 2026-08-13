import { Recipe } from "./recipe";

/*
 * ============================================================
 * Kitchen Brain
 * Planner v2 Types
 * ============================================================
 */

export type PlannerMealType =
  | "morning_drink"
  | "breakfast"
  | "lunch"
  | "snack"
  | "dinner";

export type PlannerMealStatus =
  | "planned"
  | "cooked"
  | "ate_out"
  | "skipped";

export type WeeklyMealPlanStatus =
  | "active"
  | "archived";


/*
 * One recipe attached to a meal slot.
 *
 * Example:
 * Monday Lunch
 *   - Rice
 *   - Chicken Curry
 */
export interface PlannedMealRecipe {
  id: string;

  plannedMealId: string;

  recipeId: string;

  sortOrder: number;

  recipe?: Recipe;
}


/*
 * One meal slot on one actual date.
 *
 * Example:
 * Monday 17 Aug 2026
 * Lunch
 *
 * The status belongs to the entire meal,
 * not to each individual recipe.
 */
export interface PlannedMeal {
  id: string;

  weeklyPlanId: string;

  mealDate: string;

  mealType: PlannerMealType;

  status: PlannerMealStatus;

  completedAt?: string | null;

  recipes: PlannedMealRecipe[];
}


/*
 * One real calendar week.
 *
 * weekStartDate is always Monday.
 *
 * Example:
 * 2026-08-17
 *
 * weekEndDate is intentionally NOT stored.
 * It can always be derived as:
 *
 * weekStartDate + 6 days
 */
export interface WeeklyMealPlan {
  id: string;

  weekStartDate: string;

  status: WeeklyMealPlanStatus;

  meals: PlannedMeal[];
}


/*
 * Used when creating/updating a meal
 * from the Planner UI.
 */
export interface PlannedMealInput {
  mealDate: string;

  mealType: PlannerMealType;

  recipeIds: string[];
}


/*
 * Useful for UI labels.
 */
export const PLANNER_MEAL_TYPES:
  PlannerMealType[] = [
  "morning_drink",
  "breakfast",
  "lunch",
  "snack",
  "dinner",
];


export const PLANNER_MEAL_TYPE_LABELS:
  Record<
    PlannerMealType,
    string
  > = {
  morning_drink:
    "Morning Drink",

  breakfast:
    "Breakfast",

  lunch:
    "Lunch",

  snack:
    "Snack",

  dinner:
    "Dinner",
};


export const PLANNER_MEAL_STATUS_LABELS:
  Record<
    PlannerMealStatus,
    string
  > = {
  planned:
    "Planned",

  cooked:
    "Cooked",

  ate_out:
    "Ate Out",

  skipped:
    "Skipped",
};