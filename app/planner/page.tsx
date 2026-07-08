"use client";

import { useRouter } from "next/navigation";

import AppLayout from "../../components/AppLayout";
import PlannerHeader from "../../components/planner/PlannerHeader";
import PlannerTable from "../../components/planner/PlannerTable";
import PlannerActions from "../../components/planner/PlannerActions";

import { ShoppingItem } from "../../types/shopping";

import { useKitchen } from "../../context/KitchenContext";
import { useToast } from "../../context/ToastContext";
import { aggregateIngredients } from "../../services/ingredientAggregator";
import { generateGroceryFromRecipe } from "../../services/groceryEngine";

type MealSlot =
  | "morningDrink"
  | "breakfast"
  | "lunch"
  | "snack"
  | "dinner";

export default function PlannerPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    recipes,
    pantry,
    shopping,
    setShopping,
    planner,
    setPlanner,
  } = useKitchen();

  function handleMealChange(
    dayId: string,
    mealSlot: MealSlot,
    recipeId: string
  ) {
    setPlanner(
      planner.map((plan) =>
        plan.id === dayId
          ? { ...plan, [mealSlot]: recipeId }
          : plan
      )
    );
  }

  function handleSave() {
    showToast({
      type: "success",
      message: "Weekly Meal Plan saved successfully.",
    });
  }

  function handleGenerateGrocery() {
    const selectedRecipeIds = planner
      .flatMap((plan) => [
        plan.morningDrink,
        plan.breakfast,
        plan.lunch,
        plan.snack,
        plan.dinner,
      ])
      .filter(Boolean) as string[];

    const selectedRecipes = selectedRecipeIds
      .map((recipeId) =>
        recipes.find((recipe) => recipe.id === recipeId)
      )
      .filter(Boolean);

    const allIngredients = selectedRecipes.flatMap(
      (recipe) => recipe!.ingredients
    );

    const aggregatedIngredients = aggregateIngredients(allIngredients);

    const generatedItems: ShoppingItem[] = generateGroceryFromRecipe(
      aggregatedIngredients,
      pantry
    );

    if (generatedItems.length === 0) {
      showToast({
        type: "info",
        message: "No grocery items needed. Pantry already has enough stock.",
      });
      return;
    }

    const mergedShopping = [...shopping];

    generatedItems.forEach((newItem) => {
      const existingIndex = mergedShopping.findIndex(
        (item) =>
          item.name.toLowerCase() === newItem.name.toLowerCase()
      );

      if (existingIndex >= 0) {
        mergedShopping[existingIndex] = newItem;
      } else {
        mergedShopping.push(newItem);
      }
    });

    setShopping(mergedShopping);

    showToast({
      type: "success",
      message: `${generatedItems.length} grocery items generated.`,
    });

    setTimeout(() => {
      router.push("/grocery");
    }, 1000);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <PlannerHeader />

        <PlannerTable
          plans={planner}
          recipes={recipes}
          onChange={handleMealChange}
        />

        <PlannerActions
          onSave={handleSave}
          onGenerateGrocery={handleGenerateGrocery}
        />
      </div>
    </AppLayout>
  );
}