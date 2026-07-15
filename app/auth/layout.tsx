import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#FFFDF8]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Kitchen Brain Branding Panel */}
        <section className="hidden bg-[#174D2A] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/20 bg-[#FFF8EC] shadow-lg">
              <Image
                src="/branding/kitchen-brain-icon.png"
                alt="Kitchen Brain"
                fill
                sizes="64px"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-3xl font-semibold">
                Kitchen{" "}
                <span className="text-[#E7B75B]">
                  Brain
                </span>
              </h1>

              <p className="mt-1 text-sm text-white/75">
                Plan Meals. Shop Smarter. Live Easier.
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#E7B75B]">
              Your smart family kitchen
            </p>

            <h2 className="mt-5 text-5xl font-semibold leading-tight">
              Plan your kitchen life with more clarity and less effort.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-white/75">
              Organize meals, recipes, Pantry inventory, Grocery shopping,
              and household Grocery budgets in one connected space.
            </p>
          </div>

          <p className="text-sm text-white/60">
            © 2026 Kitchen Brain. Built for smarter family kitchens.
          </p>
        </section>

        {/* Authentication Form Area */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-[#EADCC4] bg-[#FFF8EC] shadow-sm">
                <Image
                  src="/branding/kitchen-brain-icon.png"
                  alt="Kitchen Brain"
                  fill
                  sizes="56px"
                  className="object-cover"
                  priority
                />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-[#174D2A]">
                  Kitchen{" "}
                  <span className="text-[#C88A22]">
                    Brain
                  </span>
                </h1>

                <p className="text-[10px] text-gray-500">
                  Plan Meals. Shop Smarter. Live Easier.
                </p>
              </div>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}