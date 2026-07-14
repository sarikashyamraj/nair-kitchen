"use client";

import { useEffect, useMemo, useState } from "react";

import AppLayout from "../../components/AppLayout";
import ConfirmModal from "../../components/common/ConfirmModal";
import EditTransactionSheet from "../../components/budget/EditTransactionSheet";
import { useToast } from "../../context/ToastContext";
import {
  GroceryTransaction,
  MonthlyBudget,
} from "../../types/budget";

import {
  loadGroceryTransactions,
  loadMonthlyBudgets,
  saveGroceryTransactions,
  saveMonthlyBudgets,
} from "../../lib/budgetStorage";
import { loadPreferences } from "../../lib/preferencesStorage";
import { formatDateByPreference } from "../../lib/dateFormatter";
function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");

  return new Date(Number(year), Number(month) - 1).toLocaleDateString(
    "en-AE",
    {
      month: "long",
      year: "numeric",
    }
  );
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

export default function BudgetPage() {
  const { showToast } = useToast();

const [transactionToDelete, setTransactionToDelete] =
  useState<GroceryTransaction | null>(null);
  const [transactionToEdit, setTransactionToEdit] =
  useState<GroceryTransaction | null>(null);
  const currentMonth = getMonthKey(new Date());

  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [transactions, setTransactions] = useState<
    GroceryTransaction[]
  >([]);

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  const [budgetAmount, setBudgetAmount] = useState("");
const [currency, setCurrency] = useState("AED");

const [dateFormat, setDateFormat] = useState<
  "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD"
>("DD/MM/YYYY");

const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
  function refreshPreferences() {
    const preferences = loadPreferences();

    setCurrency(preferences.currency);
    setDateFormat(preferences.dateFormat);
  }

  refreshPreferences();

  setBudgets(loadMonthlyBudgets());
  setTransactions(loadGroceryTransactions());

  setIsLoaded(true);

  window.addEventListener(
    "preferences-updated",
    refreshPreferences
  );

  return () => {
    window.removeEventListener(
      "preferences-updated",
      refreshPreferences
    );
  };
}, []);
  useEffect(() => {
    if (isLoaded) {
      saveMonthlyBudgets(budgets);
    }
  }, [budgets, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveGroceryTransactions(transactions);
    }
  }, [transactions, isLoaded]);

  const selectedBudget = budgets.find(
    (budget) => budget.month === selectedMonth
  );

  const selectedMonthTransactions = useMemo(
    () =>
      transactions
        .filter((transaction) =>
          transaction.date.startsWith(selectedMonth)
        )
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        ),
    [transactions, selectedMonth]
  );

  const totalSpent = selectedMonthTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const monthlyBudget = selectedBudget?.amount || 0;
  const remaining = monthlyBudget - totalSpent;

  const usedPercentage =
    monthlyBudget > 0
      ? Math.min(
          Math.round((totalSpent / monthlyBudget) * 100),
          100
        )
      : 0;

  function handleSaveBudget() {
  const amount = Number(budgetAmount);

  if (!amount || amount <= 0) {
    showToast({
  type: "warning",
  message: "Please enter a valid monthly budget.",
});
    return;
  }

  const existingBudget = budgets.find(
    (budget) => budget.month === selectedMonth
  );

  if (existingBudget) {
    setBudgets(
      budgets.map((budget) =>
        budget.month === selectedMonth
          ? {
              ...budget,
              amount,
              currency,
            }
          : budget
      )
    );
  } else {
    setBudgets([
      ...budgets,
      {
        id: crypto.randomUUID(),
        month: selectedMonth,
        amount,
        currency,
      },
    ]);
  }
showToast({
  type: "success",
  message: `Budget for ${formatMonthLabel(
    selectedMonth
  )} saved successfully.`,
});
  setBudgetAmount("");
}

  function handleDeleteTransaction(
  transaction: GroceryTransaction
) {
  setTransactionToDelete(transaction);
}
function handleSaveEditedTransaction(data: {
  date: string;
  store: string;
  amount: number;
  description: string;
  notes: string;
}) {
  if (!transactionToEdit) return;

  setTransactions((currentTransactions) =>
    currentTransactions.map((transaction) =>
      transaction.id === transactionToEdit.id
        ? {
            ...transaction,
            date: data.date,
            store: data.store,
            amount: data.amount,
            description: data.description,
            notes: data.notes,
          }
        : transaction
    )
  );

  setTransactionToEdit(null);

  showToast({
    type: "success",
    message: "Grocery expense updated successfully.",
  });
}
return (
  <AppLayout>
      <div className="space-y-6">
        <section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#2F6B3C]">
                Grocery Budget
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Track monthly grocery spending and budget usage.
              </p>
            </div>

            <div className="w-full sm:w-auto">
              <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                Month
              </label>

              <input
                type="month"
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(event.target.value)
                }
                className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 outline-none focus:border-[#2F6B3C] sm:w-56"
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Monthly Budget
            </p>

            <p className="mt-2 text-2xl font-bold text-[#5A4032]">
              {formatCurrency(monthlyBudget, currency)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Spent So Far
            </p>

            <p className="mt-2 text-2xl font-bold text-[#5A4032]">
              {formatCurrency(totalSpent, currency)}
            </p>
          </div>

          <div className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Remaining
            </p>

            <p
              className={`mt-2 text-2xl font-bold ${
                remaining < 0
                  ? "text-red-600"
                  : "text-[#2F6B3C]"
              }`}
            >
              {formatCurrency(Math.abs(remaining), currency)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {remaining < 0
                ? "Over budget"
                : "Available"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Budget Used
            </p>

            <p className="mt-2 text-2xl font-bold text-[#5A4032]">
              {usedPercentage}%
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-[#5A4032]">
                Set Budget for {formatMonthLabel(selectedMonth)}
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={budgetAmount}
                onChange={(event) =>
                  setBudgetAmount(event.target.value)
                }
                placeholder={
                  selectedBudget
                    ? String(selectedBudget.amount)
                    : "Enter monthly grocery budget"
                }
                className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 outline-none focus:border-[#2F6B3C]"
              />
            </div>

            <button
              type="button"
              onClick={handleSaveBudget}
              className="rounded-xl bg-[#2F6B3C] px-5 py-3 font-semibold text-white"
            >
              Save Budget
            </button>
          </div>

          <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-[#F4E8D0]">
            <div
              className={`h-full rounded-full ${
                remaining < 0
                  ? "bg-red-500"
                  : usedPercentage >= 80
                  ? "bg-yellow-500"
                  : "bg-[#2F6B3C]"
              }`}
              style={{ width: `${usedPercentage}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-gray-500">
  {monthlyBudget === 0
    ? "Set a monthly grocery budget to start tracking usage."
    : remaining < 0
    ? `Budget exceeded by ${formatCurrency(
        Math.abs(remaining),
        currency
      )}.`
    : `${formatCurrency(
        remaining,
        currency
      )} remains for this month.`}
</p>
        </section>

        <section className="rounded-2xl border border-[#EADCC4] bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-[#2F6B3C]">
              Transaction History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Grocery expenses for {formatMonthLabel(selectedMonth)}.
            </p>
          </div>

          {selectedMonthTransactions.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-[#EADCC4] p-8 text-center">
              <p className="font-semibold text-[#2F6B3C]">
                No grocery expenses recorded
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Finished shopping bills will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {selectedMonthTransactions.map(
                (transaction) => (
                  <article
                    key={transaction.id}
                    className="flex flex-col gap-3 rounded-xl border border-[#F4E8D0] bg-[#FFFCF8] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-[#2F6B3C]">
                        {transaction.description}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
  {formatDateByPreference(
  transaction.date,
  dateFormat
)}

  {transaction.store && (
    <>
      {" • "}
      {transaction.store}
    </>
  )}

  {" • "}
  {transaction.itemCount} item
  {transaction.itemCount === 1 ? "" : "s"}
</p>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
  <p className="text-lg font-bold text-[#5A4032]">
    {formatCurrency(
      transaction.amount,
      transaction.currency || currency
    )}
  </p>

  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={() =>
        setTransactionToEdit(transaction)
      }
      className="rounded-lg border border-[#CFE1D2] bg-green-50 px-3 py-2 text-sm font-semibold text-[#2F6B3C]"
    >
      Edit
    </button>

    <button
      type="button"
      onClick={() =>
        handleDeleteTransaction(transaction)
      }
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
    >
      Delete
    </button>
  </div>
</div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
       

<EditTransactionSheet
  isOpen={transactionToEdit !== null}
  transaction={transactionToEdit}
  currency={
    transactionToEdit?.currency || currency
  }
  onClose={() =>
    setTransactionToEdit(null)
  }
  onSave={handleSaveEditedTransaction}
/>
        <ConfirmModal
          isOpen={transactionToDelete !== null}
          title="Delete Grocery Expense"
          message={
            transactionToDelete
              ? `Delete "${transactionToDelete.description}" for ${formatCurrency(
                  transactionToDelete.amount,
                  transactionToDelete.currency || currency
                )}?`
              : ""
          }
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() =>
            setTransactionToDelete(null)
          }
          onConfirm={() => {
            if (transactionToDelete) {
              setTransactions(
                (currentTransactions) =>
                  currentTransactions.filter(
                    (transaction) =>
                      transaction.id !==
                      transactionToDelete.id
                  )
              );

              showToast({
                type: "success",
                message:
                  "Grocery expense deleted successfully.",
              });
            }

            setTransactionToDelete(null);
          }}
        />
      </div>
    </AppLayout>
  );
}