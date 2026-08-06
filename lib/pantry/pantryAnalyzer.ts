import { PantryItem } from "../../types/pantry";

import {
  getPantryStockStatus,
  PantryStockStatus,
} from "./pantryStatus";

export interface PantrySummary {
  totalItems: number;

  inStock: number;
  lowStock: number;
  outOfStock: number;

  pantryHealth: number;

  attentionItems: PantryItem[];
  lowStockItems: PantryItem[];
  outOfStockItems: PantryItem[];
}

export function analyzePantry(
  items: PantryItem[]
): PantrySummary {
  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  const attentionItems: PantryItem[] = [];
const lowStockItems: PantryItem[] = [];
const outOfStockItems: PantryItem[] = [];
  for (const item of items) {
    const status: PantryStockStatus =
      getPantryStockStatus(item);

    switch (status) {
      case "in_stock":
        inStock++;
        break;

      case "low_stock":
  lowStock++;
  lowStockItems.push(item);
  attentionItems.push(item);
  break;

case "out_of_stock":
  outOfStock++;
  outOfStockItems.push(item);
  attentionItems.push(item);
  break;
    }
  }

  attentionItems.sort((a, b) => {
    const priority = (
      item: PantryItem
    ) => {
      const status =
        getPantryStockStatus(item);

      if (status === "out_of_stock") {
        return 0;
      }

      if (status === "low_stock") {
        return 1;
      }

      return 2;
    };

    return (
      priority(a) - priority(b)
    );
  });

  const totalItems = items.length;

  const pantryHealth =
    totalItems === 0
      ? 100
      : Math.round(
          (
            (inStock +
              lowStock * 0.5) /
            totalItems
          ) * 100
        );

  return {
  totalItems,
  inStock,
  lowStock,
  outOfStock,
  pantryHealth,
  attentionItems,
  lowStockItems,
  outOfStockItems,
};
}