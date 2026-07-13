import { ShoppingItem } from "./shopping";

export interface ShoppingSession {
  id: string;
  date: string;
  store: string;
  amount: number;
  currency: string;
  notes: string;

  purchasedItems: ShoppingItem[];

  purchasedItemCount: number;
  remainingItemCount: number;

  completedAt: string;
}