import { RecipeIngredient } from "../types/recipe";
import { ShoppingItem } from "../types/shopping";

export function addIngredientsToGrocery(
  currentGrocery: ShoppingItem[],
  ingredients: RecipeIngredient[]
): ShoppingItem[] {
  const updatedGrocery = [
    ...currentGrocery,
  ];

  ingredients.forEach((ingredient) => {
    const existingItem =
      updatedGrocery.find(
        (item) =>
          item.name
            .trim()
            .toLowerCase() ===
          ingredient.name
            .trim()
            .toLowerCase()
      );

    if (existingItem) {
      return;
    }

    updatedGrocery.push({
      id: crypto.randomUUID(),
      name: ingredient.name.trim(),
      category: "Grocery",
      quantity: `${ingredient.quantity} ${ingredient.unit}`,
      purchased: false,
    });
  });

  return updatedGrocery;
}