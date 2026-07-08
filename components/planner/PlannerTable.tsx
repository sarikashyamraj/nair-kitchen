import { MealPlan } from "../../types/planner";
import { Recipe } from "../../types/recipe";
import PlannerRow from "./PlannerRow";

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
    <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-[#F4E8D0] text-[#5A4032]">
          <tr>
            <th className="p-4">Day</th>
            <th className="p-4">Morning Drink</th>
            <th className="p-4">Breakfast</th>
            <th className="p-4">Lunch</th>
            <th className="p-4">Snack</th>
            <th className="p-4">Dinner</th>
          </tr>
        </thead>

        <tbody>
          {plans.map((plan) => (
            <PlannerRow
              key={plan.id}
              plan={plan}
              recipes={recipes}
              onChange={onChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}