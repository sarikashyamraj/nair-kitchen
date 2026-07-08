"use client";

import QuickActions from "../components/dashboard/QuickActions";
import AppLayout from "../components/AppLayout";
import { useKitchen } from "../context/KitchenContext";
import {
  BookOpen,
  Package,
  ShoppingCart,
  HeartPulse,
  } from "lucide-react";

export default function Home() {
  const { pantry, shopping, planner, recipes } = useKitchen();

  const today = new Date();

  const hour = today.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const currentDay = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const formattedDate = today.toLocaleDateString("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const todaysPlan = planner.find((plan) => plan.day === currentDay);

  const getRecipeName = (recipeId?: string) => {
    if (!recipeId) return "Not planned";

    const recipe = recipes.find((recipe) => recipe.id === recipeId);

    return recipe ? recipe.name : "Recipe not found";
  };

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

  const groceryRemaining = shopping.filter((item) => !item.purchased).length;

  const stats = [
  {
    title: "Pantry Items",
    value: totalPantryItems,
    subtitle:
      lowStockItems === 0
        ? "Well Stocked"
        : `${lowStockItems} Low Stock`,
    icon: Package,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Recipes",
    value: recipes.length,
    subtitle: "Ready to Cook",
    icon: BookOpen,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Grocery",
    value: groceryRemaining,
    subtitle:
      groceryRemaining === 0
        ? "Completed"
        : "Items Pending",
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
        : "Needs Attention",
    icon: HeartPulse,
    color: "bg-red-100 text-red-700",
  },
];

  return (
    <AppLayout>
      <div className="space-y-8">
        

        <section className="grid md:grid-cols-4 gap-5">
  {stats.map((stat) => {
    const Icon = stat.icon;

    return (
      <div
        key={stat.title}
        className="bg-white rounded-2xl border border-[#EADCC4] p-5 shadow-sm"
      >
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}
        >
          <Icon size={22} />
        </div>

        <h2 className="text-3xl font-bold text-[#5A4032] mt-4">
  {stat.value}
</h2>

<p className="text-sm font-semibold text-[#2F6B3C] mt-1">
  {stat.title}
</p>

<p className="text-xs text-gray-500 mt-1">
  {stat.subtitle}
</p>
      </div>
    );
  })}
</section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EADCC4] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#2F6B3C]">
              Today&apos;s Meal Plan
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mt-5">
              {[
  ["🥤", "Morning Drink", todaysPlan?.morningDrink],
  ["🍳", "Breakfast", todaysPlan?.breakfast],
  ["🍛", "Lunch", todaysPlan?.lunch],
  ["🥪", "Snack", todaysPlan?.snack],
  ["🥘", "Dinner", todaysPlan?.dinner],
].map(([emoji, label, recipeId]) => (
  <div
    key={label}
    className="rounded-2xl bg-gradient-to-br from-[#FFF8EC] to-white border border-[#F4E8D0] p-5 shadow-sm hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
        {emoji}
      </div>

      <div>
        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="font-semibold text-[#2F6B3C] mt-1">
          {getRecipeName(recipeId as string)}
        </p>
      </div>
    </div>
  </div>
))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EADCC4] p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#2F6B3C]">
              Pantry Health
            </h2>

            <p className="text-5xl font-bold text-[#5A4032] mt-5">
              {pantryHealth}%
            </p>

            <div className="w-full bg-[#F4E8D0] rounded-full h-4 mt-5">
              <div
                className="bg-[#2F6B3C] h-4 rounded-full"
                style={{ width: `${pantryHealth}%` }}
              />
            </div>

            <p className="text-gray-500 mt-4">
              {lowStockItems === 0
                ? "Everything looks well stocked."
                : `${lowStockItems} item(s) are running low.`}
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}