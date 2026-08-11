

import { Recipe } from "../../types/recipe";

import {
  typography,
} from "../../lib/theme/typography";

interface RecipesStatsProps {
  recipes: Recipe[];
}

export default function RecipesStats({
  recipes,
}: RecipesStatsProps) {
  const totalRecipes =
    recipes.length;

  const vegetarian =
    recipes.filter(
      (recipe) =>
        recipe.category ===
        "Vegetarian"
    ).length;

  const nonVeg =
    recipes.filter(
      (recipe) =>
        recipe.category ===
        "Non-Veg"
    ).length;

  const breakfast =
    recipes.filter((recipe) =>
      recipe.mealTypes?.includes(
        "Breakfast"
      )
    ).length;

  const metrics = [
  {
    label: "Total",
    value: totalRecipes,
    icon: "📖",
    iconClass:
      "bg-blue-50",
    valueClass:
      "text-blue-700",
  },
  {
    label: "Breakfast",
    value: breakfast,
    icon: "🍳",
    iconClass:
      "bg-amber-50",
    valueClass:
      "text-[#B87516]",
  },
  {
    label: "Veg",
    value: vegetarian,
    icon: "🥬",
    iconClass:
      "bg-green-50",
    valueClass:
      "text-green-700",
  },
  {
    label: "Non-Veg",
    value: nonVeg,
    icon: "🍗",
    iconClass:
      "bg-red-50",
    valueClass:
      "text-red-600",
  },
];

  return (
    <>
      {/* Mobile */}
      <section className="rounded-2xl border border-[#E8DED1] bg-white p-2.5 shadow-sm md:hidden">
        <div className="grid grid-cols-4 gap-1.5">
          {metrics.map(
            (metric) => {
              

              return (
                <div
                  key={
                    metric.label
                  }
                  className="rounded-xl bg-[#FCFAF6] px-1 py-2 text-center"
                >
                  <div
                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full ${metric.iconClass}`}
                  >
                    <span
  aria-hidden="true"
  className="text-[15px] leading-none"
>
  {metric.icon}
</span>
                  </div>

                  <p
                    className={`${typography.stat} mt-1 ${metric.valueClass}`}
                  >
                    {
                      metric.value
                    }
                  </p>

                  <p
                    className={`${typography.caption} mt-0.5 truncate text-[#8A8178]`}
                  >
                    {
                      metric.label
                    }
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Desktop */}
      <div className="hidden grid-cols-2 gap-4 md:grid lg:grid-cols-4">
        <div className="rounded-xl bg-blue-100 p-5 text-blue-700 shadow">
          <p className="text-sm font-medium">
            Total Recipes
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalRecipes}
          </h2>
        </div>

        <div className="rounded-xl bg-green-100 p-5 text-green-700 shadow">
          <p className="text-sm font-medium">
            Vegetarian
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {vegetarian}
          </h2>
        </div>

        <div className="rounded-xl bg-red-100 p-5 text-red-700 shadow">
          <p className="text-sm font-medium">
            Non-Veg
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {nonVeg}
          </h2>
        </div>

        <div className="rounded-xl bg-yellow-100 p-5 text-yellow-700 shadow">
          <p className="text-sm font-medium">
            Breakfast
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {breakfast}
          </h2>
        </div>
      </div>
    </>
  );
}