"use client";

import AppLayout from "../components/AppLayout";
import QuickActions from "../components/dashboard/QuickActions";
import { useKitchen } from "../context/KitchenContext";

import {
  BookOpen,
  Package,
  ShoppingCart,
  HeartPulse,
} from "lucide-react";

export default function Home() {
  const { pantry, shopping, planner, recipes } = useKitchen();

  const currentDay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todaysPlan = [...planner]
  .reverse()
  .find((plan) => plan.day === currentDay);

function getRecipeName(recipeId?: string) {
  if (!recipeId) {
    return "Not planned";
  }

  const recipe = recipes.find(
    (item) => item.id === recipeId
  );

  return recipe?.name || "Not planned";
}

const totalPantryItems = pantry.length;

  const lowStockItems = pantry.filter(
    (item) => item.quantity <= item.minQuantity
  ).length;

  const pantryHealth =
    totalPantryItems === 0
      ? 0
      : Math.round(
          ((totalPantryItems - lowStockItems) / totalPantryItems) * 100
        );

  const groceryRemaining = shopping.filter(
    (item) => !item.purchased
  ).length;

  const stats = [
    {
      title: "Pantry Items",
      value: totalPantryItems,
      subtitle:
        lowStockItems === 0
          ? "Well stocked"
          : `${lowStockItems} running low`,
      icon: Package,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Recipes",
      value: recipes.length,
      subtitle: "Ready to cook",
      icon: BookOpen,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Grocery",
      value: groceryRemaining,
      subtitle:
        groceryRemaining === 0
          ? "Completed"
          : "Items pending",
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Kitchen Health",
      value: `${pantryHealth}%`,
      subtitle:
        pantryHealth >= 90
          ? "Excellent"
          : pantryHealth >= 70
          ? "Good"
          : pantryHealth >= 50
          ? "Fair"
          : "Needs attention",
      icon: HeartPulse,
      color: "bg-red-100 text-red-700",
    },
  ];

  const mealSlots = [
    {
      emoji: "🥤",
      label: "Morning Drink",
      recipeId: todaysPlan?.morningDrink,
    },
    {
      emoji: "🍳",
      label: "Breakfast",
      recipeId: todaysPlan?.breakfast,
    },
    {
      emoji: "🍛",
      label: "Lunch",
      recipeId: todaysPlan?.lunch,
    },
    {
      emoji: "🥪",
      label: "Snack",
      recipeId: todaysPlan?.snack,
    },
    {
      emoji: "🥘",
      label: "Dinner",
      recipeId: todaysPlan?.dinner,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 lg:space-y-8">
        {/* Dashboard Statistics */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4 sm:gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#EADCC4] bg-white p-3 shadow-sm sm:p-5"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${stat.color}`}
                >
                  <Icon size={20} />
                </div>

                <h2 className="mt-3 text-2xl font-bold text-[#5A4032] sm:mt-4 sm:text-3xl">
                  {stat.value}
                </h2>

                <p className="mt-1 text-xs font-semibold text-[#2F6B3C] sm:text-sm">
                  {stat.title}
                </p>

                <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                  {stat.subtitle}
                </p>
              </div>
            );
          })}
        </section>

        

        {/* Meal Plan and Pantry Health */}
<section className="grid gap-5 lg:grid-cols-3 lg:gap-6">
  {/* Today's Meal Plan */}
  <div className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
    <h2 className="text-xl font-bold text-[#2F6B3C] sm:text-2xl">
      Today&apos;s Meal Plan
    </h2>

    <div className="mt-4 grid gap-3 sm:mt-5 md:grid-cols-2 md:gap-4">
      {mealSlots.map((meal) => (
        <div
          key={meal.label}
          className="rounded-xl border border-[#F4E8D0] bg-gradient-to-br from-[#FFF8EC] to-white p-3 shadow-sm transition-all duration-200 hover:shadow-md sm:rounded-2xl sm:p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm sm:h-12 sm:w-12 sm:text-2xl">
              {meal.emoji}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500 sm:text-sm">
                {meal.label}
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-[#2F6B3C] sm:text-base">
                {getRecipeName(meal.recipeId)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Pantry Health */}
        <div className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-[#2F6B3C] sm:text-2xl">
            Pantry Health
          </h2>

          <p className="mt-4 text-4xl font-bold text-[#5A4032] sm:mt-5 sm:text-5xl">
            {pantryHealth}%
          </p>

          <div className="mt-4 h-3 w-full rounded-full bg-[#F4E8D0] sm:mt-5 sm:h-4">
            <div
              className="h-full rounded-full bg-[#2F6B3C]"
              style={{ width: `${pantryHealth}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-500 sm:mt-4 sm:text-base">
            {lowStockItems === 0
              ? "Everything looks well stocked."
              : `${lowStockItems} item(s) are running low.`}
          </p>
 </div>
      </section>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  </AppLayout>
);
}