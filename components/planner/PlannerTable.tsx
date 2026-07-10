import { MealPlan } from "../../types/planner";
import { Recipe } from "../../types/recipe";

import PlannerDesktopTable from "./PlannerDesktopTable";
import PlannerMobileCards from "./PlannerMobileCards";

type MealSlot =
  | "morningDrink"
  | "breakfast"
  | "lunch"
  | "snack"
  | "dinner";

type PlannerTableProps = {
  plans: MealPlan[];
  recipes: Recipe[];
  onChange: (
    dayId: string,
    mealSlot: MealSlot,
    recipeId: string
  ) => void;
};

export default function PlannerTable({
  plans,
  recipes,
  onChange,
}: PlannerTableProps) {
  return (
    <>
      <PlannerMobileCards
        plans={plans}
        recipes={recipes}
        onChange={onChange}
      />

      <PlannerDesktopTable
        plans={plans}
        recipes={recipes}
        onChange={onChange}
      />
    </>
  );
}