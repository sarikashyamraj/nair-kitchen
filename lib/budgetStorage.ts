import {
  GroceryTransaction,
  MonthlyBudget,
} from "../types/budget";

const BUDGET_KEY = "nair-kitchen-monthly-budgets";
const TRANSACTION_KEY = "nair-kitchen-grocery-transactions";

export function loadMonthlyBudgets(): MonthlyBudget[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedBudgets = localStorage.getItem(BUDGET_KEY);

    return savedBudgets
      ? JSON.parse(savedBudgets)
      : [];
  } catch {
    return [];
  }
}

export function saveMonthlyBudgets(
  budgets: MonthlyBudget[]
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    BUDGET_KEY,
    JSON.stringify(budgets)
  );
}

export function loadGroceryTransactions(): GroceryTransaction[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedTransactions =
      localStorage.getItem(TRANSACTION_KEY);

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  } catch {
    return [];
  }
}

export function saveGroceryTransactions(
  transactions: GroceryTransaction[]
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    TRANSACTION_KEY,
    JSON.stringify(transactions)
  );
}