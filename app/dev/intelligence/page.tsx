"use client";

import { useMemo } from "react";

import AppLayout from "../../../components/AppLayout";
import KBCard from "../../../components/ui/KBCard";

import { useKitchen } from "../../../context/KitchenContext";

import { analyzeKitchen } from "../../../lib/intelligence/analyzer";

export default function IntelligencePreviewPage() {
  const {
    pantry,
    shopping,
    planner,
    recipes,
  } = useKitchen();

  const analysis = useMemo(() => {
    return analyzeKitchen({
      pantry,
      shopping,
      planner,
      recipes,
    });
  }, [
    pantry,
    shopping,
    planner,
    recipes,
  ]);

  return (
    <AppLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-[#2F6B3C]">
            🧠 Kitchen Intelligence Playground
          </h1>

          <p className="mt-2 text-gray-600">
            Internal developer preview of the
            Kitchen Intelligence Engine.
          </p>
        </div>

        <KBCard>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Kitchen Health
            </h2>

            <div className="text-5xl font-bold text-[#2F6B3C]">
              {analysis.score}
            </div>

            <div className="uppercase tracking-wide text-sm text-gray-500">
              {analysis.status}
            </div>
          </div>
        </KBCard>

        <KBCard>
          <h2 className="mb-4 text-xl font-semibold">
            Score Breakdown
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

            <div>
              <div className="text-sm text-gray-500">
                Pantry
              </div>

              <div className="text-2xl font-bold">
                {analysis.breakdown.pantry}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">
                Grocery
              </div>

              <div className="text-2xl font-bold">
                {analysis.breakdown.grocery}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">
                Planner
              </div>

              <div className="text-2xl font-bold">
                {analysis.breakdown.planner}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">
                Recipes
              </div>

              <div className="text-2xl font-bold">
                {analysis.breakdown.recipes}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">
                Budget
              </div>

              <div className="text-2xl font-bold">
                {analysis.breakdown.budget}
              </div>
            </div>

          </div>
        </KBCard>

        <KBCard>
          <h2 className="mb-4 text-xl font-semibold">
            Generated Insights
          </h2>

          <div className="space-y-4">

            {analysis.insights.map(
              (insight) => (
                <div
                  key={insight.id}
                  className="rounded-xl border border-[#EADCC4] p-4"
                >
                  <div className="font-semibold">
                    {insight.title}
                  </div>

                  <div className="mt-1 text-gray-600">
                    {insight.message}
                  </div>

                  <div className="mt-2 text-xs uppercase text-gray-400">
                    {insight.category} •{" "}
                    {insight.severity}
                  </div>
                </div>
              )
            )}

          </div>
        </KBCard>

        <KBCard>
          <h2 className="mb-4 text-xl font-semibold">
            Raw Analysis
          </h2>

          <pre className="overflow-auto rounded-xl bg-gray-100 p-4 text-xs">
            {JSON.stringify(
              analysis,
              null,
              2
            )}
          </pre>
        </KBCard>

      </div>
    </AppLayout>
  );
}