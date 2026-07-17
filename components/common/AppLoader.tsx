export default function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFFDF8] px-6">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF4DD] text-4xl shadow-sm">
          🍳
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#2F6B3C]">
          Kitchen Brain
        </h1>

        <p className="mt-2 text-sm text-[#6B7280] sm:text-base">
          Loading your kitchen...
        </p>

        <div className="mx-auto mt-6 h-2 w-48 overflow-hidden rounded-full bg-[#F4E8D0]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#D89B3C]" />
        </div>
      </div>
    </div>
  );
}