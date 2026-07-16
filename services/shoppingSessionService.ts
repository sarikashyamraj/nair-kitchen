import { createClient } from "../utils/supabase/client";

import { ShoppingItem } from "../types/shopping";
import { ShoppingSession } from "../types/shoppingSession";

type ShoppingSessionRow = {
  id: string;
  user_id: string;
  shopping_date: string;
  store_name: string;
  amount: number | string;
  currency_code: string;
  notes: string | null;
  purchased_items: unknown;
  purchased_item_count: number;
  remaining_item_count: number;
  completed_at: string;
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
      "You must be signed in to access Shopping History."
    );
  }

  return {
    supabase,
    user,
  };
}

function isShoppingItem(
  value: unknown
): value is ShoppingItem {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const item =
    value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.category === "string" &&
    typeof item.quantity === "string" &&
    typeof item.purchased === "boolean"
  );
}

function parsePurchasedItems(
  value: unknown
): ShoppingItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isShoppingItem);
}

function mapShoppingSessionRow(
  row: ShoppingSessionRow
): ShoppingSession {
  return {
    id: row.id,
    date: row.shopping_date,
    store: row.store_name,
    amount: Number(row.amount),
    currency: row.currency_code,
    notes: row.notes || "",
    purchasedItems:
      parsePurchasedItems(
        row.purchased_items
      ),
    purchasedItemCount:
      row.purchased_item_count,
    remainingItemCount:
      row.remaining_item_count,
    completedAt: row.completed_at,
  };
}

export async function loadCloudShoppingSessions(): Promise<
  ShoppingSession[]
> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("shopping_sessions")
    .select(
      `
        id,
        user_id,
        shopping_date,
        store_name,
        amount,
        currency_code,
        notes,
        purchased_items,
        purchased_item_count,
        remaining_item_count,
        completed_at
      `
    )
    .eq("user_id", user.id)
    .order("completed_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (
    data as ShoppingSessionRow[]
  ).map(mapShoppingSessionRow);
}

export async function saveCloudShoppingSession(
  session: ShoppingSession
): Promise<ShoppingSession> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const payload = {
    user_id: user.id,
    shopping_date: session.date,
    store_name: session.store.trim(),
    amount: session.amount,
    currency_code: session.currency,
    notes:
      session.notes.trim() || null,
    purchased_items:
      session.purchasedItems,
    purchased_item_count:
      session.purchasedItemCount,
    remaining_item_count:
      session.remainingItemCount,
    completed_at:
      session.completedAt,
  };

  const hasUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      session.id
    );

  let cloudSessionExists = false;

  if (hasUuid) {
    const {
      data: existingSession,
      error: checkError,
    } = await supabase
      .from("shopping_sessions")
      .select("id")
      .eq("id", session.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      throw new Error(
        checkError.message
      );
    }

    cloudSessionExists =
      Boolean(existingSession);
  }

  if (cloudSessionExists) {
    const {
      data: updatedSession,
      error: updateError,
    } = await supabase
      .from("shopping_sessions")
      .update(payload)
      .eq("id", session.id)
      .eq("user_id", user.id)
      .select(
        `
          id,
          user_id,
          shopping_date,
          store_name,
          amount,
          currency_code,
          notes,
          purchased_items,
          purchased_item_count,
          remaining_item_count,
          completed_at
        `
      )
      .single();

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    return mapShoppingSessionRow(
      updatedSession as ShoppingSessionRow
    );
  }

  const {
    data: insertedSession,
    error: insertError,
  } = await supabase
    .from("shopping_sessions")
    .insert(payload)
    .select(
      `
        id,
        user_id,
        shopping_date,
        store_name,
        amount,
        currency_code,
        notes,
        purchased_items,
        purchased_item_count,
        remaining_item_count,
        completed_at
      `
    )
    .single();

  if (insertError) {
    throw new Error(
      insertError.message
    );
  }

  return mapShoppingSessionRow(
    insertedSession as ShoppingSessionRow
  );
}

export async function deleteCloudShoppingSession(
  sessionId: string
): Promise<void> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { error } = await supabase
    .from("shopping_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}