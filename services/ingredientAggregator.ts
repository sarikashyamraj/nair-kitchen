import { RecipeIngredient } from "../types/recipe";
import { convertToBaseUnit, getBaseUnit } from "./unitConverter";

export function aggregateIngredients(
  ingredients: RecipeIngredient[]
): RecipeIngredient[] {
  const map = new Map<string, RecipeIngredient>();

  ingredients.forEach((ingredient) => {
    const baseUnit = getBaseUnit(ingredient.unit);

    const key = `${ingredient.name.toLowerCase()}-${baseUnit}`;

    const convertedQuantity = convertToBaseUnit(
      ingredient.quantity,
      ingredient.unit
    );

    if (map.has(key)) {
      const existing = map.get(key)!;

      existing.quantity += convertedQuantity;
    } else {
      map.set(key, {
        name: ingredient.name,
        quantity: convertedQuantity,
        unit: baseUnit,
      });
    }
  });

  return Array.from(map.values());
}