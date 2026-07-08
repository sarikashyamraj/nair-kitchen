export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export type MealType =
  | "Morning Drink"
  | "Breakfast"
  | "Lunch"
  | "Snack"
  | "Dinner";

export interface Recipe {
  id: string;
  name: string;
  category: string;
  mealTypes: MealType[];
  cookingTime: string;
  ingredients: RecipeIngredient[];
  instructions: string;
}