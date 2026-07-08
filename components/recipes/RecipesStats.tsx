import { Recipe } from "../../types/recipe";

interface RecipesStatsProps {
  recipes: Recipe[];
}

export default function RecipesStats({
  recipes,
}: RecipesStatsProps) {

  const totalRecipes = recipes.length;

  const vegetarian = recipes.filter(
    (recipe) => recipe.category === "Vegetarian"
  ).length;

  const nonVeg = recipes.filter(
    (recipe) => recipe.category === "Non-Veg"
  ).length;

  const breakfast = recipes.filter((recipe) =>
  recipe.mealTypes?.includes("Breakfast")
).length;

  const cards = [
    {
      title: "Total Recipes",
      value: totalRecipes,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Vegetarian",
      value: vegetarian,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Non-Veg",
      value: nonVeg,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Breakfast",
      value: breakfast,
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl p-5 shadow ${card.color}`}
        >
          <p className="text-sm font-medium">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}