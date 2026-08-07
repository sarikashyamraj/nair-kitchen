// Home Inventory / Grocery Categories

export const HOME_INVENTORY_CATEGORIES = [
  "Grains",
  "Dairy",
  "Vegetables",
  "Fruits",
  "Meat",
  "Seafood",
  "Household",
  "Spices",
  "Snacks",
  "Beverages",
  "Frozen",
  "Bakery",
  "Other",
] as const;

/*
 * Backward-compatible export.
 *
 * Existing forms and services currently import
 * INGREDIENT_CATEGORIES, so we keep this alias
 * until the future Inventory refactor.
 */
export const INGREDIENT_CATEGORIES = [
  ...HOME_INVENTORY_CATEGORIES,
];


// Recipe Categories

export const RECIPE_CATEGORIES = [
  "Vegetarian",
  "Non-Veg",
  "Vegan",
];


// Meal Types

export const MEAL_TYPES = [
  "Morning Drink",
  "Breakfast",
  "Lunch",
  "Snack",
  "Dinner",
] as const;