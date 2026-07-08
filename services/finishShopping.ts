import { PantryItem } from "../types/pantry";
import { ShoppingItem } from "../types/shopping";

function parseQuantity(quantityText: string) {
  const parts = quantityText.trim().split(" ");
  const quantity = Number(parts[0]);
  const unit = parts.slice(1).join(" ") || "pcs";

  return {
    quantity: isNaN(quantity) ? 1 : quantity,
    unit,
  };
}

export function updatePantryFromPurchasedItems(
  pantry: PantryItem[],
  shopping: ShoppingItem[]
) {
  const purchasedItems = shopping.filter((item) => item.purchased);

  let updatedPantry = [...pantry];

  purchasedItems.forEach((shoppingItem) => {
    const parsed = parseQuantity(shoppingItem.quantity);

    const existingIndex = updatedPantry.findIndex(
      (pantryItem) =>
        pantryItem.name.toLowerCase() === shoppingItem.name.toLowerCase()
    );

    if (existingIndex >= 0) {
      const existingItem = updatedPantry[existingIndex];

      updatedPantry[existingIndex] = {
        ...existingItem,
        quantity: existingItem.quantity + parsed.quantity,
      };
    } else {
      updatedPantry.push({
        id: crypto.randomUUID(),
        name: shoppingItem.name,
        category: shoppingItem.category,
        quantity: parsed.quantity,
        unit: parsed.unit,
        minQuantity: 1,
      });
    }
  });

  const remainingShopping = shopping.filter((item) => !item.purchased);

  return {
    updatedPantry,
    remainingShopping,
    purchasedCount: purchasedItems.length,
  };
}