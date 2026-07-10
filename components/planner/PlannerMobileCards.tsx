import { MealPlan } from "../../types/planner";
import { Recipe } from "../../types/recipe";

type MealSlot =
  | "morningDrink"
  | "breakfast"
  | "lunch"
  | "snack"
  | "dinner";

type PlannerMobileCardsProps = {
  plans: MealPlan[];
  recipes: Recipe[];
  onChange: (
    dayId: string,
    mealSlot: MealSlot,
    recipeId: string
  ) => void;
};

const mealSlots: {
  key: MealSlot;
  label: string;
  emoji: string;
}[] = [
  {
    key: "morningDrink",
    label: "Morning Drink",
    emoji: "🥤",
  },
  {
    key: "breakfast",
    label: "Breakfast",
    emoji: "🍳",
  },
  {
    key: "lunch",
    label: "Lunch",
    emoji: "🍛",
  },
  {
    key: "snack",
    label: "Snack",
    emoji: "🥪",
  },
  {
    key: "dinner",
    label: "Dinner",
    emoji: "🥘",
  },
];

const mealTypeMap = {
  morningDrink: "Morning Drink",
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
} as const;

export default function PlannerMobileCards({
  plans,
  recipes,
  onChange,
}: PlannerMobileCardsProps) {
  function isRecipeSuitable(
    recipe: Recipe,
    mealSlot: MealSlot
  ) {
    const requiredMealType = mealTypeMap[mealSlot];

    if (recipe.mealTypes?.includes(requiredMealType)) {
      return true;
    }

    const oldRecipe = recipe as Recipe & {
      mealType?: string;
    };

    return oldRecipe.mealType?.includes(requiredMealType) ?? false;
  }

  return (
    <div className="space-y-3 md:hidden">
      {plans.map((plan, index) => {
  const isAlternateDay = index % 2 === 0;

  return (
    <article
      key={plan.id}
      className={`rounded-2xl border p-4 shadow-sm ${
        isAlternateDay
          ? "border-[#E4D2AF] bg-[#FFF4DD]"
          : "border-[#EADCC4] bg-white"
      }`}
    >
          <h2 className="text-lg font-bold text-[#2F6B3C]">
            {plan.day}
          </h2>

          <div className="mt-4 space-y-3">
            {mealSlots.map((mealSlot) => {
              const filteredRecipes = recipes.filter(
                (recipe) =>
                  isRecipeSuitable(recipe, mealSlot.key)
              );

              return (
                <div key={mealSlot.key}>
                  <label className="mb-1.5 block text-sm font-medium text-[#5A4032]">
                    {mealSlot.emoji} {mealSlot.label}
                  </label>

                  <select
                    value={plan[mealSlot.key] || ""}
                    onChange={(event) =>
                      onChange(
                        plan.id,
                        mealSlot.key,
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-[#EADCC4] bg-white px-3 py-2.5 text-sm text-[#5A4032] focus:border-[#2F6B3C] focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
                  >
                    <option value="">Select recipe</option>

                    {filteredRecipes.map((recipe) => (
                      <option
                        key={recipe.id}
                        value={recipe.id}
                      >
                        {recipe.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </article>
            );
    })}
    </div>
  );
}