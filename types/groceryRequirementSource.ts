export type GroceryRequirementSourceType =
  | "recipe"
  | "planner";

export interface GroceryRequirementSource {
  id: string;

  groceryItemId: string;

  sourceType: GroceryRequirementSourceType;

  sourceId: string;

  sourceName: string;

  ingredientName: string;

  quantity: number;

  unit: string;

  createdAt?: string;

  updatedAt?: string;
}