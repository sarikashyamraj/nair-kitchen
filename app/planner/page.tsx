"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  loadCloudPlanner,
  saveCloudPlanner,
} from "../../services/plannerService";
import AppLayout from "../../components/AppLayout";
import PlannerHeader from "../../components/planner/PlannerHeader";
import PlannerTable from "../../components/planner/PlannerTable";
import PlannerActions from "../../components/planner/PlannerActions";
import MobilePageHeader from "../../components/mobile/MobilePageHeader";

import { ShoppingItem } from "../../types/shopping";
import { MealPlan } from "../../types/planner";

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

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [loadError, setLoadError] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPlannerData() {
      try {
        setLoadError("");

        const cloudPlanner =
  await loadCloudPlanner();

if (!isMounted) return;

setPlanner(cloudPlanner);
      } catch (error) {
        if (!isMounted) return;

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load Meal Planner.";

        setLoadError(message);

        showToast({
          type: "error",
          message,
        });
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    }

    void loadPlannerData();

    return () => {
      isMounted = false;
    };
  }, [setPlanner, showToast]);

  function handleMealChange(
    dayId: string,
    mealSlot: MealSlot,
    recipeId: string
  ) {
    setPlanner((currentPlanner) =>
      currentPlanner.map((plan) =>
        plan.id === dayId
          ? {
              ...plan,
              [mealSlot]: recipeId,
            }
          : plan
      )
    );
  }

  async function handleSave() {
    try {
      setIsSaving(true);

      const savedPlanner =
        await saveCloudPlanner(planner);

      setPlanner(savedPlanner);

      showToast({
        type: "success",
        message:
          "Weekly Meal Plan saved successfully.",
      });
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save Weekly Meal Plan.",
      });
    } finally {
      setIsSaving(false);
    }
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

    const selectedRecipes =
      selectedRecipeIds
        .map((recipeId) =>
          recipes.find(
            (recipe) =>
              recipe.id === recipeId
          )
        )
        .filter(Boolean);

    const allIngredients =
      selectedRecipes.flatMap(
        (recipe) =>
          recipe!.ingredients
      );

    const aggregatedIngredients =
      aggregateIngredients(
        allIngredients
      );

    const generatedItems: ShoppingItem[] =
      generateGroceryFromRecipe(
        aggregatedIngredients,
        pantry
      );

    if (generatedItems.length === 0) {
      showToast({
        type: "info",
        message:
          "No grocery items needed. Pantry already has enough stock.",
      });
      return;
    }

    const mergedShopping = [
      ...shopping,
    ];

    generatedItems.forEach(
      (newItem) => {
        const existingIndex =
          mergedShopping.findIndex(
            (item) =>
              item.name.toLowerCase() ===
              newItem.name.toLowerCase()
          );

        if (existingIndex >= 0) {
          mergedShopping[
            existingIndex
          ] = newItem;
        } else {
          mergedShopping.push(
            newItem
          );
        }
      }
    );

    setShopping(mergedShopping);

    showToast({
      type: "success",
      message: `${generatedItems.length} grocery items generated.`,
    });

    window.setTimeout(() => {
      router.push("/grocery");
    }, 1000);
  }

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="font-semibold text-[#2F6B3C]">
            Loading Meal Planner...
          </p>
        </div>
      </AppLayout>
    );
  }

  if (loadError) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          {loadError}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-24 md:pb-0">
        <div className="sticky top-0 z-30 -mx-4 bg-[#FFFDF8] px-4 pb-3 pt-1 md:hidden">
          <MobilePageHeader
            title="Weekly Planner"
            subtitle="Plan your family meals for the week"
          />
        </div>

        <PlannerHeader />

        <PlannerTable
          plans={planner}
          recipes={recipes}
          onChange={handleMealChange}
        />

        <PlannerActions
          onSave={handleSave}
          onGenerateGrocery={
            handleGenerateGrocery
          }
        />

        {isSaving && (
          <p className="text-center text-sm font-medium text-[#2F6B3C]">
            Saving your weekly plan...
          </p>
        )}
      </div>
    </AppLayout>
  );
}