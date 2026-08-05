"use client";

import Link from "next/link";
import { WalletCards } from "lucide-react";

interface BudgetOverviewProps {
  monthlyBudget: number;
  monthlySpent: number;
  currency: string;
  isLoading: boolean;
  error?: string;
}

function formatCurrency(
  amount: number,
  currency: string
) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function BudgetOverview({
  monthlyBudget,
  monthlySpent,
  currency,
  isLoading,
  error = "",
}: BudgetOverviewProps) {
  const budgetRemaining =
    monthlyBudget - monthlySpent;

  const budgetUsedPercentage =
    monthlyBudget > 0
      ? Math.round(
          (monthlySpent / monthlyBudget) *
            100
        )
      : 0;

  const progressWidth = Math.min(
    Math.max(budgetUsedPercentage, 0),
    100
  );

  return (
    <section className="rounded-3xl border border-[#EADCC4] bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <WalletCards size={22} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#C9872F]">
              Monthly Budget
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#2F6B3C] sm:text-3xl">
              Track Your Spending
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Keep your grocery budget under control.
            </p>
          </div>
        </div>

        <Link
          href="/budget"
          className="shrink-0 rounded-xl border border-[#EADCC4] bg-[#FFF8EC] px-3 py-2 text-sm font-semibold text-[#5A4032] transition hover:bg-[#F4E8D0]"
        >
          View Budget
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-5 animate-pulse">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="h-20 rounded-xl bg-[#F4E8D0]" />
            <div className="h-20 rounded-xl bg-gray-100" />
            <div className="col-span-2 h-20 rounded-xl bg-green-50 md:col-span-1" />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="h-4 w-10 rounded bg-gray-100" />
            </div>

            <div className="mt-3 h-3 w-full rounded-full bg-gray-100" />

            <div className="mt-3 h-4 w-56 rounded bg-gray-100" />
          </div>
        </div>
      ) : error ? (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-700">
            Unable to Load Budget
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <Link
            href="/budget"
            className="mt-4 inline-flex rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700"
          >
            Open Budget
          </Link>
        </div>
      ) : monthlyBudget === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-[#EADCC4] bg-[#FFFCF8] p-5 text-center">
          <p className="font-semibold text-[#2F6B3C]">
            No Monthly Budget Set
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Set a grocery budget to start tracking
            your monthly spending.
          </p>

          <Link
            href="/budget"
            className="mt-4 inline-flex rounded-xl bg-[#2F6B3C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#285C34]"
          >
            Set Budget
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-[#FFF8EC] p-4">
              <p className="text-xs text-gray-500">
                Budget
              </p>

              <p className="mt-1 text-lg font-bold text-[#5A4032]">
                {formatCurrency(
                  monthlyBudget,
                  currency
                )}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-xs text-gray-500">
                Spent
              </p>

              <p className="mt-1 text-lg font-bold text-blue-700">
                {formatCurrency(
                  monthlySpent,
                  currency
                )}
              </p>
            </div>

            <div
              className={`col-span-2 rounded-xl p-4 md:col-span-1 ${
                budgetRemaining < 0
                  ? "bg-red-50"
                  : "bg-green-50"
              }`}
            >
              <p className="text-xs text-gray-500">
                {budgetRemaining < 0
                  ? "Over Budget"
                  : "Remaining"}
              </p>

              <p
                className={`mt-1 text-lg font-bold ${
                  budgetRemaining < 0
                    ? "text-red-600"
                    : "text-green-700"
                }`}
              >
                {formatCurrency(
                  Math.abs(budgetRemaining),
                  currency
                )}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-[#5A4032]">
                Budget Used
              </p>

              <p
                className={`text-sm font-bold ${
                  budgetRemaining < 0
                    ? "text-red-600"
                    : "text-[#2F6B3C]"
                }`}
              >
                {budgetUsedPercentage}%
              </p>
            </div>

            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#F4E8D0]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetRemaining < 0
                    ? "bg-red-500"
                    : budgetUsedPercentage >= 80
                      ? "bg-yellow-500"
                      : "bg-[#2F6B3C]"
                }`}
                style={{
                  width: `${progressWidth}%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {budgetRemaining < 0
                ? `You have exceeded this month’s budget by ${formatCurrency(
                    Math.abs(budgetRemaining),
                    currency
                  )}.`
                : `${formatCurrency(
                    budgetRemaining,
                    currency
                  )} is still available this month.`}
            </p>
          </div>
        </>
      )}
    </section>
  );
}