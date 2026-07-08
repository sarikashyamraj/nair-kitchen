export interface MealPlan {
  id: string;
  day: string;
  morningDrink?: string;
  breakfast?: string;
  lunch?: string;
  snack?: string;
  dinner?: string;
}