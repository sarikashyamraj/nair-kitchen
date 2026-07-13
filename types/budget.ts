export interface MonthlyBudget {
  id: string;
  month: string;
  amount: number;
  currency: string;
}

export interface GroceryTransaction {
  id: string;
  shoppingSessionId: string;
  date: string;
  amount: number;
  currency: string;
  description: string;
  store: string;
  notes?: string;
  itemCount: number;
}