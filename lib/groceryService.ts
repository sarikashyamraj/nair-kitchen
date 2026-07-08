import { RecipeIngredient } from "../types/recipe";
import { ShoppingItem } from "../types/shopping";
import {
  loadShopping,
  saveShopping,
} from "./shoppingStorage";

export function addIngredientsToGrocery(
  ingredients: RecipeIngredient[]
) {
  const grocery = loadShopping();

  ingredients.forEach((ingredient) => {
    const existing = grocery.find(
      (item) =>
        item.name.toLowerCase() ===
        ingredient.name.toLowerCase()
    );

    if (existing) {
      return;
    }

    const shoppingItem: ShoppingItem = {
      id: Date.now().toString() + Math.random(),
      name: ingredient.name,
      category: "Grocery",
      quantity: `${ingredient.quantity} ${ingredient.unit}`,
      purchased: false,
    };

    grocery.push(shoppingItem);
  });

  saveShopping(grocery);
}