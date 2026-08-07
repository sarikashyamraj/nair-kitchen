import { PantryItem } from "../../types/pantry";

import {
  HomeInventoryCategory,
} from "./inventoryCategories";

export type InventoryCategorySummary = {
  category: HomeInventoryCategory;
  totalItems: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
};

export function analyzeInventoryCategory(
  items: PantryItem[],
  category: HomeInventoryCategory
): InventoryCategorySummary {
  const categoryItems =
    items.filter(
      (item) =>
        item.category === category
    );

  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  categoryItems.forEach(
    (item) => {
      if (item.quantity <= 0) {
        outOfStock += 1;

        return;
      }

      if (
        item.quantity <=
        item.minQuantity
      ) {
        lowStock += 1;

        return;
      }

      inStock += 1;
    }
  );

  return {
    category,
    totalItems:
      categoryItems.length,
    inStock,
    lowStock,
    outOfStock,
  };
}