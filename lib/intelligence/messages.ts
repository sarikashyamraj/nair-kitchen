export type PantryMessageInput = {
  totalItems: number;
  lowStockCount: number;
  visibleNames: string[];
};

export type GroceryMessageInput = {
  totalItems: number;
  purchasedItems: number;
  remainingItems: number;
  completionPercentage: number;
};

export type PlannerMessageInput = {
  plannedCount: number;
  totalSlots: number;
  currentDay: string;
};

export type RecipeMessageInput = {
  recipeCount: number;
};

export type BudgetMessageInput = {
  monthlyBudget: number;
  monthlySpent: number;
  currency: string;
  usagePercentage: number;
};

export function getPantryMessage(
  input: PantryMessageInput
) {
  if (input.totalItems === 0) {
    return {
      title: "Start Building Your Pantry",
      message:
        "Add your pantry items to unlock smarter grocery and recipe recommendations.",
    };
  }

  if (input.lowStockCount === 0) {
    return {
      title: "Your Pantry Looks Healthy",
      message:
        "Everything is currently above its minimum stock level.",
    };
  }

  const visibleItems =
    input.visibleNames.join(", ");

  const remainingCount = Math.max(
    input.lowStockCount -
      input.visibleNames.length,
    0
  );

  const itemText =
    remainingCount > 0
      ? `${visibleItems} and ${remainingCount} more ${
          remainingCount === 1
            ? "item is"
            : "items are"
        } running low.`
      : `${visibleItems} ${
          input.lowStockCount === 1
            ? "is"
            : "are"
        } running low.`;

  return {
    title:
      input.lowStockCount >= 5
        ? "Your Pantry Needs Attention"
        : "A Few Pantry Items Are Running Low",
    message: `${itemText} Review them before your next shopping trip.`,
  };
}

export function getGroceryMessage(
  input: GroceryMessageInput
) {
  if (input.totalItems === 0) {
    return {
      title: "Your Grocery List Is Clear",
      message:
        "Add items whenever you are ready to plan your next shopping trip.",
    };
  }

  if (input.remainingItems === 0) {
    return {
      title: "Your Shopping Is Complete",
      message:
        "Finish shopping to move the purchased items into your pantry automatically.",
    };
  }

  if (input.completionPercentage >= 75) {
    return {
      title: "You Are Almost Done Shopping",
      message: `Only ${input.remainingItems} ${
        input.remainingItems === 1
          ? "item remains"
          : "items remain"
      }. Complete the trip to update your pantry.`,
    };
  }

  if (input.purchasedItems === 0) {
    return {
      title: "Your Grocery Trip Is Ready",
      message: `${input.remainingItems} ${
        input.remainingItems === 1
          ? "item is"
          : "items are"
      } waiting on your list.`,
    };
  }

  return {
    title: "Shopping Is In Progress",
    message: `${input.purchasedItems} of ${input.totalItems} items are purchased, with ${input.remainingItems} still pending.`,
  };
}

export function getPlannerMessage(
  input: PlannerMessageInput
) {
  const missingCount =
    input.totalSlots -
    input.plannedCount;

  if (input.plannedCount === 0) {
    return {
      title: `${input.currentDay} Is Not Planned Yet`,
      message:
        "Plan your meals now to avoid last-minute cooking decisions and reduce food waste.",
    };
  }

  if (missingCount === 0) {
    return {
      title: `${input.currentDay} Is Fully Planned`,
      message:
        "All meal slots are ready, so your kitchen routine is on track.",
    };
  }

  return {
    title: "Your Meal Plan Needs a Little Work",
    message: `${input.plannedCount} of ${input.totalSlots} meal slots are planned. Complete the remaining ${missingCount} ${
      missingCount === 1
        ? "slot"
        : "slots"
    } when convenient.`,
  };
}

export function getRecipeMessage(
  input: RecipeMessageInput
) {
  if (input.recipeCount === 0) {
    return {
      title: "Add Your First Recipes",
      message:
        "Saved recipes will power smarter meal planning and pantry-based recommendations.",
    };
  }

  if (input.recipeCount < 5) {
    return {
      title: "Build More Recipe Variety",
      message: `You currently have ${input.recipeCount} saved ${
        input.recipeCount === 1
          ? "recipe"
          : "recipes"
      }. Add more options to improve future meal suggestions.`,
    };
  }

  if (input.recipeCount < 10) {
    return {
      title: "Your Recipe Collection Is Growing",
      message: `You have ${input.recipeCount} recipes available. A few more will give Kitchen Brain better variety for planning.`,
    };
  }

  return {
    title: "You Have Good Recipe Variety",
    message: `${input.recipeCount} recipes are available for meal planning and future smart suggestions.`,
  };
}

export function getBudgetMessage(
  input: BudgetMessageInput
) {
  if (input.monthlyBudget <= 0) {
    return {
      title: "Set a Monthly Grocery Budget",
      message:
        "A budget helps Kitchen Brain monitor spending and generate useful money-saving insights.",
    };
  }

  if (input.usagePercentage > 100) {
    const overspentAmount =
      input.monthlySpent -
      input.monthlyBudget;

    return {
      title: "Your Grocery Budget Has Been Exceeded",
      message: `You are ${input.currency} ${overspentAmount.toFixed(
        2
      )} over budget this month. Review recent transactions to identify where spending increased.`,
    };
  }

  if (input.usagePercentage >= 80) {
    return {
      title: "Your Budget Is Nearly Used",
      message: `${input.usagePercentage}% of this month's grocery budget has been spent. Consider limiting non-essential purchases for the rest of the month.`,
    };
  }

  if (input.usagePercentage >= 50) {
    return {
      title: "Your Grocery Spending Is on Track",
      message: `${input.usagePercentage}% of the monthly budget has been used so far.`,
    };
  }

  return {
    title: "You Are Managing Your Budget Well",
    message: `Only ${input.usagePercentage}% of this month's grocery budget has been spent. Great job keeping costs under control.`,
  };
}