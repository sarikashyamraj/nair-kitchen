import { RecipeIngredient } from "../types/recipe";
import { PantryItem } from "../types/pantry";
import { ShoppingItem } from "../types/shopping";
import { convertToBaseUnit, getBaseUnit } from "./unitConverter";

export function generateGroceryFromRecipe(
  ingredients: RecipeIngredient[],
  pantryItems: PantryItem[]
): ShoppingItem[] {
  const groceryItems: ShoppingItem[] = [];

  ingredients.forEach((ingredient) => {
    const pantryItem = pantryItems.find(
      (item) =>
        item.name.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (!pantryItem) {
      groceryItems.push({
        id: crypto.randomUUID(),
        name: ingredient.name,
        category: "Grocery",
        quantity: `${ingredient.quantity} ${ingredient.unit}`,
        purchased: false,
      });

      return;
    }

    const neededQty = convertToBaseUnit(
      ingredient.quantity,
      ingredient.unit
    );

    const availableQty = convertToBaseUnit(
      pantryItem.quantity,
      pantryItem.unit
    );

    const missingQty = neededQty - availableQty;

    if (missingQty > 0) {
      groceryItems.push({
        id: crypto.randomUUID(),
        name: ingredient.name,
        category: pantryItem.category,
        quantity: `${missingQty} ${getBaseUnit(ingredient.unit)}`,
        purchased: false,
      });
    }
  });

  return groceryItems;
}