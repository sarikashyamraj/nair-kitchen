"use client";

type DashboardCardSkeletonProps = {
  variant?:
    | "overview"
    | "timeline"
    | "alerts"
    | "progress";
};

export default function DashboardCardSkeleton({
  variant = "overview",
}: DashboardCardSkeletonProps) {
  if (variant === "timeline") {
    return (
      <section className="animate-pulse rounded-3xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-3 w-24 rounded bg-[#F4E8D0]" />
            <div className="mt-3 h-7 w-48 rounded bg-[#E8EFE8]" />
            <div className="mt-3 h-4 w-36 rounded bg-gray-100" />
          </div>

          <div className="h-10 w-24 rounded-xl bg-[#FFF4DD]" />
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#F0E6D6]">
          {Array.from({ length: 5 }).map(
            (_, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3.5 sm:px-5 ${
                  index !== 4
                    ? "border-b border-[#F0E6D6]"
                    : ""
                }`}
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#F4E8D0]" />

                <div className="min-w-0 flex-1">
                  <div className="h-3 w-20 rounded bg-gray-100" />
                  <div className="mt-2 h-4 w-40 rounded bg-[#E8EFE8]" />
                </div>

                <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  if (variant === "alerts") {
    return (
      <section className="animate-pulse rounded-3xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-3 w-24 rounded bg-[#F4E8D0]" />
            <div className="mt-3 h-7 w-56 rounded bg-[#E8EFE8]" />
            <div className="mt-3 h-4 w-40 rounded bg-gray-100" />
          </div>

          <div className="h-10 w-24 rounded-xl bg-[#FFF4DD]" />
        </div>

        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-[#F0E6D6] p-4"
              >
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FFF1D6]" />

                <div className="min-w-0 flex-1">
                  <div className="h-4 w-32 rounded bg-[#E8EFE8]" />
                  <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
                </div>

                <div className="h-5 w-5 rounded bg-[#FFF1D6]" />
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  if (variant === "progress") {
    return (
      <section className="animate-pulse rounded-3xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-3 w-28 rounded bg-[#F4E8D0]" />
            <div className="mt-3 h-7 w-44 rounded bg-[#E8EFE8]" />
            <div className="mt-3 h-4 w-40 rounded bg-gray-100" />
          </div>

          <div className="h-10 w-24 rounded-xl bg-[#FFF4DD]" />
        </div>

        <div className="mt-5 rounded-2xl border border-[#F0E6D6] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[#EAF4FB]" />

              <div>
                <div className="h-7 w-16 rounded bg-[#E8EFE8]" />
                <div className="mt-2 h-3 w-20 rounded bg-gray-100" />
              </div>
            </div>

            <div className="text-right">
              <div className="ml-auto h-5 w-8 rounded bg-[#F4E8D0]" />
              <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
            </div>
          </div>

          <div className="mt-4 h-3 w-full rounded-full bg-gray-100" />

          <div className="mt-3 h-4 w-52 rounded bg-gray-100" />
        </div>
      </section>
    );
  }

  return (
    <section className="animate-pulse overflow-hidden rounded-3xl border border-[#EADCC4] bg-white shadow-sm">
      <div className="bg-gradient-to-br from-[#F4FAF3] via-white to-[#FFF8EB] p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-3 w-28 rounded bg-[#F4E8D0]" />
            <div className="mt-3 h-8 w-64 max-w-full rounded bg-[#E8EFE8]" />
            <div className="mt-3 h-4 w-52 max-w-full rounded bg-gray-100" />
          </div>

          <div className="h-20 w-20 shrink-0 rounded-full bg-[#E8EFE8]" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#F0E6D6] bg-white p-3"
              >
                <div className="h-9 w-9 rounded-xl bg-[#F4E8D0]" />
                <div className="mt-3 h-3 w-16 rounded bg-gray-100" />
                <div className="mt-2 h-6 w-20 rounded bg-[#E8EFE8]" />
              </div>
            )
          )}
        </div>
      </div>

      <div className="border-t border-[#F0E6D6] bg-[#FFFDF8] px-5 py-3">
        <div className="h-4 w-52 rounded bg-gray-100" />
      </div>
    </section>
  );
}