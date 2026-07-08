import { MealPlan } from "../../types/planner";
import { Recipe } from "../../types/recipe";

type MealSlot =
  | "morningDrink"
  | "breakfast"
  | "lunch"
  | "snack"
  | "dinner";

type PlannerRowProps = {
  plan: MealPlan;
  recipes: Recipe[];
  onChange: (
    dayId: string,
    mealSlot: MealSlot,
    recipeId: string
  ) => void;
};

const mealTypeMap = {
  morningDrink: "Morning Drink",
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  dinner: "Dinner",
} as const;

export default function PlannerRow({
  plan,
  recipes,
  onChange,
}: PlannerRowProps) {
  function isRecipeSuitable(recipe: Recipe, mealSlot: MealSlot) {
    const requiredMealType = mealTypeMap[mealSlot];

    if (recipe.mealTypes?.includes(requiredMealType)) {
      return true;
    }

    const oldRecipe = recipe as Recipe & { mealType?: string };

    if (oldRecipe.mealType) {
      return oldRecipe.mealType.includes(requiredMealType);
    }

    return false;
  }

  function renderRecipeSelect(mealSlot: MealSlot) {
    const filteredRecipes = recipes.filter((recipe) =>
      isRecipeSuitable(recipe, mealSlot)
    );

    return (
      <select
        value={plan[mealSlot] || ""}
        onChange={(e) =>
          onChange(plan.id, mealSlot, e.target.value)
        }
        className="w-full rounded-xl border p-2"
      >
        <option value="">Select recipe</option>

        {filteredRecipes.map((recipe) => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <tr className="border-t border-[#F4E8D0]">
      <td className="p-4 font-medium text-[#5A4032]">
        {plan.day}
      </td>

      <td className="p-4">{renderRecipeSelect("morningDrink")}</td>
      <td className="p-4">{renderRecipeSelect("breakfast")}</td>
      <td className="p-4">{renderRecipeSelect("lunch")}</td>
      <td className="p-4">{renderRecipeSelect("snack")}</td>
      <td className="p-4">{renderRecipeSelect("dinner")}</td>
    </tr>
  );
}