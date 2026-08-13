import {
  createClient,
} from "../utils/supabase/client";

import {
  PlannedMeal,
  PlannedMealRecipe,
  PlannerMealStatus,
  PlannerMealType,
  WeeklyMealPlan,
  WeeklyMealPlanStatus,
} from "../types/plannerV2";

import {
  Recipe,
} from "../types/recipe";


/* ============================================================
   Database Row Types
============================================================ */

type WeeklyMealPlanRow = {
  id: string;

  user_id: string;

  week_start_date: string;

  status:
    WeeklyMealPlanStatus;

  created_at: string;

  updated_at: string;

  planned_meals?:
    PlannedMealRow[];
};


type PlannedMealRow = {
  id: string;

  weekly_plan_id: string;

  meal_date: string;

  meal_type:
    PlannerMealType;

  status:
    PlannerMealStatus;

  completed_at:
    string | null;

  created_at: string;

  updated_at: string;

  planned_meal_recipes?:
    PlannedMealRecipeRow[];
};


type PlannedMealRecipeRow = {
  id: string;

  planned_meal_id: string;

  recipe_id: string;

  sort_order: number;

  created_at: string;

  recipes?:
    RecipeRow | null;
};


type RecipeRow = {
  id: string;

  name: string;

  category: string;

  meal_types: string[];

  cooking_time:
    string | null;

  instructions:
    string | null;

  recipe_ingredients?:
    RecipeIngredientRow[];
};


type RecipeIngredientRow = {
  id: string;

  name: string;

  quantity:
    number | string;

  unit: string;
};


/* ============================================================
   Authentication
============================================================ */

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
      "You must be signed in to access the Weekly Planner."
    );
  }

  return {
    supabase,
    user,
  };
}


/* ============================================================
   Mapping Helpers
============================================================ */

function mapRecipe(
  row: RecipeRow
): Recipe {
  return {
    id:
      row.id,

    name:
      row.name,

    category:
      row.category,

    mealTypes:
      row.meal_types as Recipe["mealTypes"],

    cookingTime:
      row.cooking_time ||
      "",

    instructions:
      row.instructions ||
      "",

    ingredients:
      (
        row.recipe_ingredients ||
        []
      ).map(
        (ingredient) => ({
          name:
            ingredient.name,

          quantity:
            Number(
              ingredient.quantity
            ),

          unit:
            ingredient.unit,
        })
      ),
  };
}


function mapPlannedMealRecipe(
  row:
    PlannedMealRecipeRow
): PlannedMealRecipe {
  return {
    id:
      row.id,

    plannedMealId:
      row.planned_meal_id,

    recipeId:
      row.recipe_id,

    sortOrder:
      row.sort_order,

    recipe:
      row.recipes
        ? mapRecipe(
            row.recipes
          )
        : undefined,
  };
}


function mapPlannedMeal(
  row:
    PlannedMealRow
): PlannedMeal {
  const recipes =
    (
      row
        .planned_meal_recipes ||
      []
    )
      .map(
        mapPlannedMealRecipe
      )
      .sort(
        (
          first,
          second
        ) =>
          first.sortOrder -
          second.sortOrder
      );

  return {
    id:
      row.id,

    weeklyPlanId:
      row.weekly_plan_id,

    mealDate:
      row.meal_date,

    mealType:
      row.meal_type,

    status:
      row.status,

    completedAt:
      row.completed_at,

    recipes,
  };
}


function mapWeeklyMealPlan(
  row:
    WeeklyMealPlanRow
): WeeklyMealPlan {
  const meals =
    (
      row.planned_meals ||
      []
    )
      .map(
        mapPlannedMeal
      )
      .sort(
        (
          first,
          second
        ) => {
          const dateCompare =
            first.mealDate.localeCompare(
              second.mealDate
            );

          if (
            dateCompare !== 0
          ) {
            return dateCompare;
          }

          const mealOrder:
            PlannerMealType[] = [
            "morning_drink",
            "breakfast",
            "lunch",
            "snack",
            "dinner",
          ];

          return (
            mealOrder.indexOf(
              first.mealType
            ) -
            mealOrder.indexOf(
              second.mealType
            )
          );
        }
      );

  return {
    id:
      row.id,

    weekStartDate:
      row.week_start_date,

    status:
      row.status,

    meals,
  };
}


/* ============================================================
   Week Helpers
============================================================ */

function assertMonday(
  weekStartDate: string
) {
  const date =
    new Date(
      `${weekStartDate}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "Invalid week start date."
    );
  }

  /*
   * JavaScript:
   * Sunday = 0
   * Monday = 1
   */
  if (
    date.getDay() !==
    1
  ) {
    throw new Error(
      "Weekly Planner start date must be a Monday."
    );
  }
}


/* ============================================================
   Load One Week

   Browsing an empty week does NOT create
   a database record.
============================================================ */

export async function loadCloudWeeklyMealPlan(
  weekStartDate: string
): Promise<WeeklyMealPlan | null> {
  assertMonday(
    weekStartDate
  );

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
        "weekly_meal_plans"
      )
      .select(
        `
          id,
          user_id,
          week_start_date,
          status,
          created_at,
          updated_at,

          planned_meals (
            id,
            weekly_plan_id,
            meal_date,
            meal_type,
            status,
            completed_at,
            created_at,
            updated_at,

            planned_meal_recipes (
              id,
              planned_meal_id,
              recipe_id,
              sort_order,
              created_at,

              recipes (
                id,
                name,
                category,
                meal_types,
                cooking_time,
                instructions,

                recipe_ingredients (
                  id,
                  name,
                  quantity,
                  unit
                )
              )
            )
          )
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "week_start_date",
        weekStartDate
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (!data) {
    return null;
  }

  return mapWeeklyMealPlan(
    data as WeeklyMealPlanRow
  );
}


/* ============================================================
   Get or Create Week

   IMPORTANT:
   Only call this when the user actually
   adds something to the week.

   Merely browsing weeks should use
   loadCloudWeeklyMealPlan().
============================================================ */

export async function getOrCreateCloudWeeklyMealPlan(
  weekStartDate: string
): Promise<WeeklyMealPlan> {
  assertMonday(
    weekStartDate
  );

  const existingPlan =
    await loadCloudWeeklyMealPlan(
      weekStartDate
    );

  if (existingPlan) {
    return existingPlan;
  }

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
        "weekly_meal_plans"
      )
      .insert({
        user_id:
          user.id,

        week_start_date:
          weekStartDate,

        status:
          "active",
      })
      .select(
        `
          id,
          user_id,
          week_start_date,
          status,
          created_at,
          updated_at
        `
      )
      .single();

  if (error) {
    /*
     * If another request created the
     * same week at almost the same time,
     * retry loading it rather than
     * creating duplicates.
     */
    const retry =
      await loadCloudWeeklyMealPlan(
        weekStartDate
      );

    if (retry) {
      return retry;
    }

    throw new Error(
      error.message
    );
  }

  return {
    id:
      data.id,

    weekStartDate:
      data.week_start_date,

    status:
      data.status,

    meals: [],
  };
}


/* ============================================================
   Create / Get One Meal Slot
============================================================ */

export async function getOrCreateCloudPlannedMeal(
  weeklyPlanId: string,
  mealDate: string,
  mealType:
    PlannerMealType
): Promise<PlannedMeal> {
  const {
    supabase,
  } =
    await getAuthenticatedUser();

  const {
    data: existingMeal,
    error:
      existingError,
  } =
    await supabase
      .from(
        "planned_meals"
      )
      .select(
        `
          id,
          weekly_plan_id,
          meal_date,
          meal_type,
          status,
          completed_at,
          created_at,
          updated_at
        `
      )
      .eq(
        "weekly_plan_id",
        weeklyPlanId
      )
      .eq(
        "meal_date",
        mealDate
      )
      .eq(
        "meal_type",
        mealType
      )
      .maybeSingle();

  if (existingError) {
    throw new Error(
      existingError.message
    );
  }

  if (existingMeal) {
    return {
      id:
        existingMeal.id,

      weeklyPlanId:
        existingMeal.weekly_plan_id,

      mealDate:
        existingMeal.meal_date,

      mealType:
        existingMeal.meal_type,

      status:
        existingMeal.status,

      completedAt:
        existingMeal.completed_at,

      recipes: [],
    };
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "planned_meals"
      )
      .insert({
        weekly_plan_id:
          weeklyPlanId,

        meal_date:
          mealDate,

        meal_type:
          mealType,

        status:
          "planned",
      })
      .select(
        `
          id,
          weekly_plan_id,
          meal_date,
          meal_type,
          status,
          completed_at,
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

  return {
    id:
      data.id,

    weeklyPlanId:
      data.weekly_plan_id,

    mealDate:
      data.meal_date,

    mealType:
      data.meal_type,

    status:
      data.status,

    completedAt:
      data.completed_at,

    recipes: [],
  };
}


/* ============================================================
   Add Recipe to Meal

   Multiple recipes are supported.

   Database uniqueness prevents the
   same recipe being added twice to the
   same meal.
============================================================ */

export async function addRecipeToCloudPlannedMeal(
  plannedMealId: string,
  recipeId: string
): Promise<void> {
  const {
    supabase,
  } =
    await getAuthenticatedUser();

  /*
   * Determine next sort position.
   */
  const {
    data:
      existingRecipes,
    error:
      loadError,
  } =
    await supabase
      .from(
        "planned_meal_recipes"
      )
      .select(
        "sort_order"
      )
      .eq(
        "planned_meal_id",
        plannedMealId
      )
      .order(
        "sort_order",
        {
          ascending:
            false,
        }
      )
      .limit(
        1
      );

  if (loadError) {
    throw new Error(
      loadError.message
    );
  }

  const nextSortOrder =
    existingRecipes &&
    existingRecipes.length >
      0
      ? Number(
          existingRecipes[0]
            .sort_order
        ) + 1
      : 0;

  const {
    error,
  } =
    await supabase
      .from(
        "planned_meal_recipes"
      )
      .insert({
        planned_meal_id:
          plannedMealId,

        recipe_id:
          recipeId,

        sort_order:
          nextSortOrder,
      });

  if (error) {
    /*
     * Duplicate recipe in the same
     * meal should not crash the app.
     */
    if (
      error.code ===
      "23505"
    ) {
      return;
    }

    throw new Error(
      error.message
    );
  }
}


/* ============================================================
   Remove Recipe from Meal
============================================================ */

export async function removeRecipeFromCloudPlannedMeal(
  plannedMealId: string,
  recipeId: string
): Promise<void> {
  const {
    supabase,
  } =
    await getAuthenticatedUser();

  const {
    error,
  } =
    await supabase
      .from(
        "planned_meal_recipes"
      )
      .delete()
      .eq(
        "planned_meal_id",
        plannedMealId
      )
      .eq(
        "recipe_id",
        recipeId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}


/* ============================================================
   Update Meal Status

   IMPORTANT:
   This only updates Planner status.

   Pantry consumption will be added
   later as a separate controlled flow.
============================================================ */

export async function updateCloudPlannedMealStatus(
  plannedMealId: string,
  status:
    PlannerMealStatus
): Promise<void> {
  const {
    supabase,
  } =
    await getAuthenticatedUser();

  const completedAt =
    status ===
      "cooked"
      ? new Date()
          .toISOString()
      : null;

  const {
    error,
  } =
    await supabase
      .from(
        "planned_meals"
      )
      .update({
        status,

        completed_at:
          completedAt,
      })
      .eq(
        "id",
        plannedMealId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}


/* ============================================================
   Delete Empty Meal Slot

   Useful when the last recipe is removed.

   We should not keep unnecessary blank
   planned_meals rows.
============================================================ */

export async function deleteCloudPlannedMeal(
  plannedMealId: string
): Promise<void> {
  const {
    supabase,
  } =
    await getAuthenticatedUser();

  const {
    error,
  } =
    await supabase
      .from(
        "planned_meals"
      )
      .delete()
      .eq(
        "id",
        plannedMealId
      );

  if (error) {
    throw new Error(
      error.message
    );
  }
}