import { createClient } from "../utils/supabase/client";

type MonthlyBudgetRow = {
  amount: number | string;
  currency_code: string;
};

type GroceryTransactionRow = {
  amount: number | string;
};

export type DashboardBudgetSummary = {
  monthlyBudget: number;
  monthlySpent: number;
  currency: string;
};

function getMonthDateRange(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const monthKey = `${year}-${String(
    month + 1
  ).padStart(2, "0")}`;

  const startDate = `${monthKey}-01`;

  const nextMonth = new Date(
    year,
    month + 1,
    1
  );

  const nextMonthKey = `${nextMonth.getFullYear()}-${String(
    nextMonth.getMonth() + 1
  ).padStart(2, "0")}`;

  const endDate = `${nextMonthKey}-01`;

  return {
    monthKey,
    startDate,
    endDate,
  };
}

export async function loadDashboardBudgetSummary(
  fallbackCurrency = "AED"
): Promise<DashboardBudgetSummary> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to load the Dashboard budget."
    );
  }

  const {
    monthKey,
    startDate,
    endDate,
  } = getMonthDateRange(new Date());

  const [
    budgetResult,
    transactionsResult,
  ] = await Promise.all([
    supabase
      .from("monthly_budgets")
      .select(
        `
          amount,
          currency_code
        `
      )
      .eq("user_id", user.id)
      .eq("month_key", monthKey)
      .maybeSingle(),

    supabase
      .from("grocery_transactions")
      .select("amount")
      .eq("user_id", user.id)
      .gte("shopping_date", startDate)
      .lt("shopping_date", endDate),
  ]);

  if (budgetResult.error) {
    throw new Error(
      budgetResult.error.message
    );
  }

  if (transactionsResult.error) {
    throw new Error(
      transactionsResult.error.message
    );
  }

  const budgetRow =
    budgetResult.data as MonthlyBudgetRow | null;

  const transactionRows =
    (transactionsResult.data ??
      []) as GroceryTransactionRow[];

  const monthlySpent =
    transactionRows.reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount),
      0
    );

  return {
    monthlyBudget: budgetRow
      ? Number(budgetRow.amount)
      : 0,

    monthlySpent,

    currency:
      budgetRow?.currency_code ||
      fallbackCurrency,
  };
}