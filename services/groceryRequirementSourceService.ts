import {
  createClient,
} from "../utils/supabase/client";

import {
  GroceryRequirementSource,
  GroceryRequirementSourceType,
} from "../types/groceryRequirementSource";

type GroceryRequirementSourceRow = {
  id: string;
  user_id: string;
  grocery_item_id: string;
  source_type: GroceryRequirementSourceType;
  source_id: string;
  source_name: string;
  ingredient_name: string;
  quantity: number | string;
  unit: string;
  created_at: string;
  updated_at: string;
};

async function getAuthenticatedUser() {
  const supabase =
    createClient();

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (!user) {
    throw new Error(
      "You must be signed in to manage Grocery requirement sources."
    );
  }

  return {
    supabase,
    user,
  };
}

function mapRequirementSourceRow(
  row: GroceryRequirementSourceRow
): GroceryRequirementSource {
  return {
    id:
      row.id,

    groceryItemId:
      row.grocery_item_id,

    sourceType:
      row.source_type,

    sourceId:
      row.source_id,

    sourceName:
      row.source_name,

    ingredientName:
      row.ingredient_name,

    quantity:
      Number(
        row.quantity
      ),

    unit:
      row.unit,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}

/* ==========================================
   Load all requirement sources
========================================== */

export async function loadCloudGroceryRequirementSources():
Promise<GroceryRequirementSource[]> {
  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "grocery_requirement_sources"
      )
      .select(
        `
          id,
          user_id,
          grocery_item_id,
          source_type,
          source_id,
          source_name,
          ingredient_name,
          quantity,
          unit,
          created_at,
          updated_at
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        }
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (
    data as GroceryRequirementSourceRow[]
  ).map(
    mapRequirementSourceRow
  );
}

/* ==========================================
   Load sources for one recipe / planner
========================================== */

export async function loadCloudGroceryRequirementSourcesBySource(
  sourceType:
    GroceryRequirementSourceType,
  sourceId: string
): Promise<GroceryRequirementSource[]> {
  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "grocery_requirement_sources"
      )
      .select(
        `
          id,
          user_id,
          grocery_item_id,
          source_type,
          source_id,
          source_name,
          ingredient_name,
          quantity,
          unit,
          created_at,
          updated_at
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "source_type",
        sourceType
      )
      .eq(
        "source_id",
        sourceId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  return (
    data as GroceryRequirementSourceRow[]
  ).map(
    mapRequirementSourceRow
  );
}

/* ==========================================
   Save / update one source allocation
========================================== */

export async function saveCloudGroceryRequirementSource(
  source:
    GroceryRequirementSource
): Promise<GroceryRequirementSource> {
  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const payload = {
    user_id:
      user.id,

    grocery_item_id:
      source.groceryItemId,

    source_type:
      source.sourceType,

    source_id:
      source.sourceId,

    source_name:
      source.sourceName,

    ingredient_name:
      source.ingredientName.trim(),

    quantity:
      source.quantity,

    unit:
      source.unit.trim(),

    updated_at:
      new Date().toISOString(),
  };

  /*
   * The database has a unique
   * constraint on:
   *
   * user_id
   * grocery_item_id
   * source_type
   * source_id
   * ingredient_name
   *
   * so upsert lets the same source
   * update its allocation instead of
   * creating duplicates.
   */
  const {
    data,
    error,
  } =
    await supabase
      .from(
        "grocery_requirement_sources"
      )
      .upsert(
        payload,
        {
          onConflict:
            "user_id,grocery_item_id,source_type,source_id,ingredient_name",
        }
      )
      .select(
        `
          id,
          user_id,
          grocery_item_id,
          source_type,
          source_id,
          source_name,
          ingredient_name,
          quantity,
          unit,
          created_at,
          updated_at
        `
      )
      .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return mapRequirementSourceRow(
    data as GroceryRequirementSourceRow
  );
}

/* ==========================================
   Save many source allocations
========================================== */

export async function saveCloudGroceryRequirementSources(
  sources:
    GroceryRequirementSource[]
): Promise<GroceryRequirementSource[]> {
  return Promise.all(
    sources.map(
      (source) =>
        saveCloudGroceryRequirementSource(
          source
        )
    )
  );
}

/* ==========================================
   Delete one source allocation
========================================== */

export async function deleteCloudGroceryRequirementSource(
  sourceId: string
): Promise<void> {
  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const {
    error,
  } =
    await supabase
      .from(
        "grocery_requirement_sources"
      )
      .delete()
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "id",
        sourceId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}

/* ==========================================
   Delete all allocations for one source
========================================== */

export async function deleteCloudGroceryRequirementSourcesBySource(
  sourceType:
    GroceryRequirementSourceType,
  sourceId: string
): Promise<void> {
  const {
    supabase,
    user,
  } =
    await getAuthenticatedUser();

  const {
    error,
  } =
    await supabase
      .from(
        "grocery_requirement_sources"
      )
      .delete()
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "source_type",
        sourceType
      )
      .eq(
        "source_id",
        sourceId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}