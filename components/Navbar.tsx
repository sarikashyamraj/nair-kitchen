import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-green-700 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">
        <div>
          <h1 className="text-3xl font-bold text-white">
            🏡 Kitchen Brain
          </h1>

          <p className="text-green-100 text-sm">
            Plan Meals. Shop Smarter. Live Easier.
          </p>
        </div>

        <nav className="flex gap-6 text-white font-medium">
          <Link href="/" className="hover:text-green-200">
            🏠 Dashboard
          </Link>

          <Link href="/planner" className="hover:text-green-200">
            📅 Planner
          </Link>

          <Link href="/recipes" className="hover:text-green-200">
            📖 Recipes
          </Link>

          <Link href="/pantry" className="hover:text-green-200">
            🥫 Pantry
          </Link>

          <Link href="/grocery" className="hover:text-green-200">
            🛒 Grocery
          </Link>
        </nav>
      </div>
    </header>
  );
}