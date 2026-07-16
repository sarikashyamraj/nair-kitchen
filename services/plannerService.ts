import { createClient } from "../utils/supabase/client";

import { MealPlan } from "../types/planner";

type MealPlanRow = {
  id: string;
  user_id: string;
  day_name: string;
  morning_drink_recipe_id: string | null;
  breakfast_recipe_id: string | null;
  lunch_recipe_id: string | null;
  snack_recipe_id: string | null;
  dinner_recipe_id: string | null;
};

const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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
      "You must be signed in to access the Meal Planner."
    );
  }

  return {
    supabase,
    user,
  };
}

function mapMealPlanRow(
  row: MealPlanRow
): MealPlan {
  return {
    id: row.id,
    day: row.day_name,
    morningDrink:
      row.morning_drink_recipe_id || "",
    breakfast:
      row.breakfast_recipe_id || "",
    lunch:
      row.lunch_recipe_id || "",
    snack:
      row.snack_recipe_id || "",
    dinner:
      row.dinner_recipe_id || "",
  };
}

function sortMealPlans(
  plans: MealPlan[]
): MealPlan[] {
  return [...plans].sort(
    (firstPlan, secondPlan) =>
      dayOrder.indexOf(firstPlan.day) -
      dayOrder.indexOf(secondPlan.day)
  );
}

export async function loadCloudPlanner(): Promise<
  MealPlan[]
> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("meal_plans")
    .select(
      `
        id,
        user_id,
        day_name,
        morning_drink_recipe_id,
        breakfast_recipe_id,
        lunch_recipe_id,
        snack_recipe_id,
        dinner_recipe_id
      `
    )
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return sortMealPlans(
    (data as MealPlanRow[]).map(
      mapMealPlanRow
    )
  );
}

async function getValidRecipeIds(): Promise<
  Set<string>
> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const { data, error } = await supabase
    .from("recipes")
    .select("id")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return new Set(
    (data || []).map(
      (recipe) => recipe.id
    )
  );
}

function sanitizeRecipeId(
  recipeId: string | undefined,
  validRecipeIds: Set<string>
): string | null {
  if (
    recipeId &&
    validRecipeIds.has(recipeId)
  ) {
    return recipeId;
  }

  return null;
}

export async function saveCloudPlanner(
  plans: MealPlan[]
): Promise<MealPlan[]> {
  const { supabase, user } =
    await getAuthenticatedUser();

  const validRecipeIds =
    await getValidRecipeIds();

  const rows = plans.map((plan) => ({
    user_id: user.id,
    day_name: plan.day,

    morning_drink_recipe_id:
      sanitizeRecipeId(
        plan.morningDrink,
        validRecipeIds
      ),

    breakfast_recipe_id:
      sanitizeRecipeId(
        plan.breakfast,
        validRecipeIds
      ),

    lunch_recipe_id:
      sanitizeRecipeId(
        plan.lunch,
        validRecipeIds
      ),

    snack_recipe_id:
      sanitizeRecipeId(
        plan.snack,
        validRecipeIds
      ),

    dinner_recipe_id:
      sanitizeRecipeId(
        plan.dinner,
        validRecipeIds
      ),
  }));

  const { data, error } = await supabase
    .from("meal_plans")
    .upsert(rows, {
      onConflict: "user_id,day_name",
    })
    .select(
      `
        id,
        user_id,
        day_name,
        morning_drink_recipe_id,
        breakfast_recipe_id,
        lunch_recipe_id,
        snack_recipe_id,
        dinner_recipe_id
      `
    );

  if (error) {
    throw new Error(error.message);
  }

  return sortMealPlans(
    (data as MealPlanRow[]).map(
      mapMealPlanRow
    )
  );
}