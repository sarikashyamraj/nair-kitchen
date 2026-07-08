"use client";

import Link from "next/link";
import AppLayout from "../components/AppLayout";
import { useKitchen } from "../context/KitchenContext";
import {
  CalendarDays,
  BookOpen,
  Package,
  ShoppingCart,
  HeartPulse,
  Plus,
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
      icon: Package,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Recipes",
      value: recipes.length,
      icon: BookOpen,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Grocery Pending",
      value: groceryRemaining,
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Kitchen Health",
      value: `${pantryHealth}%`,
      icon: HeartPulse,
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        <section className="rounded-3xl bg-[#2F6B3C] text-white p-8 shadow-md">
          <p className="text-sm opacity-90">{formattedDate}</p>

          <h1 className="text-4xl font-bold mt-3">
            {greeting}, Sarika 🌿
          </h1>

          <p className="mt-3 text-white/90">
            Here&apos;s what&apos;s happening in your kitchen today.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/planner"
              className="bg-white text-[#2F6B3C] px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <CalendarDays size={18} />
              Plan Week
            </Link>

            <Link
              href="/recipes"
              className="bg-[#D89B3C] text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <Plus size={18} />
              Add Recipe
            </Link>

            <Link
              href="/pantry"
              className="bg-white/15 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <Package size={18} />
              Pantry
            </Link>
          </div>
        </section>

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

                <p className="text-sm text-gray-500 mt-4">{stat.title}</p>

                <h2 className="text-3xl font-bold text-[#5A4032] mt-1">
                  {stat.value}
                </h2>
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
                  className="rounded-xl bg-[#FFF8EC] border border-[#F4E8D0] p-4"
                >
                  <p className="text-sm text-gray-500">
                    {emoji} {label}
                  </p>

                  <p className="font-semibold text-[#5A4032] mt-1">
                    {getRecipeName(recipeId as string)}
                  </p>
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