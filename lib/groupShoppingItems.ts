import { ShoppingItem } from "../types/shopping";

export function groupShoppingItems(items: ShoppingItem[]) {
  return items.reduce((groups, item) => {
    const category = item.category || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(item);

    return groups;
  }, {} as Record<string, ShoppingItem[]>);
}