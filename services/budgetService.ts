import { createClient } from "../utils/supabase/client";

import {
  GroceryTransaction,
  MonthlyBudget,
} from "../types/budget";

type BudgetRow = {
  id: string;
  user_id: string;
  month_key: string;
  amount: number | string;
  currency_code: string;
};

type TransactionRow = {
  id: string;
  user_id: string;
  shopping_session_id: string | null;
  shopping_date: string;
  amount: number | string;
  currency_code: string;
  description: string;
  store_name: string | null;
  notes: string | null;
  item_count: number;
};

async function getAuthenticatedUser() {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to access Budget."
    );
  }

  return {
    supabase,
    user,
  };
}

function mapBudgetRow(
  row: BudgetRow
): MonthlyBudget {
  return {
    id: row.id,
    month: row.month_key,
    amount: Number(row.amount),
    currency: row.currency_code,
  };
}

function mapTransactionRow(
  row: TransactionRow
): GroceryTransaction {
  return {
    id: row.id,
    shoppingSessionId:
      row.shopping_session_id || "",
    date: row.shopping_date,
    amount: Number(row.amount),
    currency: row.currency_code,
    description: row.description,
    store: row.store_name || "",
    notes: row.notes || "",
    itemCount: row.item_count,
  };
}

export async function loadCloudBudgets(): Promise<
  MonthlyBudget[]
> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("monthly_budgets")
    .select(
      `
        id,
        user_id,
        month_key,
        amount,
        currency_code
      `
    )
    .eq("user_id", user.id)
    .order("month_key", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as BudgetRow[]).map(
    mapBudgetRow
  );
}

export async function loadCloudTransactions(): Promise<
  GroceryTransaction[]
> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("grocery_transactions")
    .select(
      `
        id,
        user_id,
        shopping_session_id,
        shopping_date,
        amount,
        currency_code,
        description,
        store_name,
        notes,
        item_count
      `
    )
    .eq("user_id", user.id)
    .order("shopping_date", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data as TransactionRow[]).map(
    mapTransactionRow
  );
}

export async function saveCloudBudget(
  budget: MonthlyBudget
): Promise<MonthlyBudget> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("monthly_budgets")
    .upsert(
      {
        user_id: user.id,
        month_key: budget.month,
        amount: budget.amount,
        currency_code: budget.currency,
      },
      {
        onConflict: "user_id,month_key",
      }
    )
    .select(
      `
        id,
        user_id,
        month_key,
        amount,
        currency_code
      `
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapBudgetRow(
    data as BudgetRow
  );
}

export async function saveCloudTransaction(
  transaction: GroceryTransaction
): Promise<GroceryTransaction> {
  const { supabase, user } =
    await getAuthenticatedUser();

  /*
   * Shopping Sessions are not cloud-connected yet.
   * Keep this null temporarily to avoid a foreign-key
   * error from old Local Storage session IDs.
   */
  const payload = {
    user_id: user.id,
    shopping_session_id: null,
    shopping_date: transaction.date,
    amount: transaction.amount,
    currency_code: transaction.currency,
    description:
      transaction.description.trim() ||
      "Grocery Shopping",
    store_name:
      transaction.store.trim() || null,
    notes:
      transaction.notes?.trim() || null,
    item_count: transaction.itemCount,
  };

  const hasUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      transaction.id
    );

  let cloudTransactionExists = false;

  if (hasUuid) {
    const {
      data: existingTransaction,
      error: checkError,
    } = await supabase
      .from("grocery_transactions")
      .select("id")
      .eq("id", transaction.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw new Error(
        checkError.message
      );
    }

    cloudTransactionExists = Boolean(
      existingTransaction
    );
  }

  if (cloudTransactionExists) {
    const {
      data: updatedTransaction,
      error: updateError,
    } = await supabase
      .from("grocery_transactions")
      .update(payload)
      .eq("id", transaction.id)
      .eq("user_id", user.id)
      .select(
        `
          id,
          user_id,
          shopping_session_id,
          shopping_date,
          amount,
          currency_code,
          description,
          store_name,
          notes,
          item_count
        `
      )
      .single();

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    return mapTransactionRow(
      updatedTransaction as TransactionRow
    );
  }

  const {
    data: insertedTransaction,
    error: insertError,
  } = await supabase
    .from("grocery_transactions")
    .insert(payload)
    .select(
      `
        id,
        user_id,
        shopping_session_id,
        shopping_date,
        amount,
        currency_code,
        description,
        store_name,
        notes,
        item_count
      `
    )
    .single();

  if (insertError) {
    throw new Error(
      insertError.message
    );
  }

  return mapTransactionRow(
    insertedTransaction as TransactionRow
  );
}

export async function deleteCloudTransaction(
  transactionId: string
): Promise<void> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { error } = await supabase
    .from("grocery_transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}