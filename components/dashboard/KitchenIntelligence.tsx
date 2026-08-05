"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
    BookOpen,
    Brain,
    CalendarDays,
    ChevronRight,
    Package,
    ShoppingCart,
    WalletCards,
} from "lucide-react";

import KBCard from "../ui/KBCard";
import KBSectionHeader from "../ui/KBSectionHeader";

import { useKitchen } from "../../context/KitchenContext";
import { analyzeKitchen } from "../../lib/intelligence/analyzer";
import type {
    InsightCategory,
    KitchenHealthStatus,
} from "../../lib/intelligence/types";

interface KitchenIntelligenceProps {
    monthlyBudget?: number;
    monthlySpent?: number;
    currency?: string;
}

const categoryStyles: Record<
    InsightCategory,
    {
        icon: typeof Package;
        iconClassName: string;
        iconBackgroundClassName: string;
    }
> = {
    pantry: {
        icon: Package,
        iconClassName: "text-green-700",
        iconBackgroundClassName: "bg-green-100",
    },
    grocery: {
        icon: ShoppingCart,
        iconClassName: "text-sky-700",
        iconBackgroundClassName: "bg-sky-100",
    },
    planner: {
        icon: CalendarDays,
        iconClassName: "text-purple-700",
        iconBackgroundClassName: "bg-purple-100",
    },
    recipes: {
        icon: BookOpen,
        iconClassName: "text-amber-700",
        iconBackgroundClassName: "bg-amber-100",
    },
    budget: {
        icon: WalletCards,
        iconClassName: "text-violet-700",
        iconBackgroundClassName: "bg-violet-100",
    },
    kitchen: {
        icon: Brain,
        iconClassName: "text-[#2F6B3C]",
        iconBackgroundClassName: "bg-[#E9F4EB]",
    },
};

const statusStyles: Record<
    KitchenHealthStatus,
    {
        label: string;
        badgeClassName: string;
        ringColor: string;
    }
> = {
    excellent: {
        label: "Excellent",
        badgeClassName:
            "border-green-200 bg-green-50 text-green-700",
        ringColor: "#2F6B3C",
    },
    good: {
        label: "Good",
        badgeClassName:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        ringColor: "#4A8A58",
    },
    "needs-attention": {
        label: "Needs Attention",
        badgeClassName:
            "border-amber-200 bg-amber-50 text-amber-700",
        ringColor: "#D89B3C",
    },
    critical: {
        label: "Critical",
        badgeClassName:
            "border-red-200 bg-red-50 text-red-700",
        ringColor: "#DC5A5A",
    },
};

export default function KitchenIntelligence({
    monthlyBudget = 0,
    monthlySpent = 0,
    currency = "AED",
}: KitchenIntelligenceProps) {
    const {
        pantry,
        shopping,
        planner,
        recipes,
    } = useKitchen();

    const analysis = useMemo(
        () =>
            analyzeKitchen({
                pantry,
                shopping,
                planner,
                recipes,
                budget: {
                    monthlyBudget,
                    monthlySpent,
                    currency,
                },
            }),
        [
            pantry,
            shopping,
            planner,
            recipes,
            monthlyBudget,
            monthlySpent,
            currency,
        ]
    );

    const visibleInsights =
        analysis.insights.slice(0, 3);

    const statusStyle =
        statusStyles[analysis.status];

    const scoreDegrees =
        Math.min(
            Math.max(analysis.score, 0),
            100
        ) * 3.6;

    return (
        <KBCard>
            <KBSectionHeader
                title="Kitchen Intelligence"
                description="Your most important kitchen recommendations right now."
            />

            <div className="mt-5 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="self-start rounded-2xl border border-[#F0E1C9] bg-gradient-to-br from-[#FFF8EA] to-[#FFFDF8] p-5">
                    <div className="flex flex-col items-center text-center">
                        <div
                            className="relative flex h-40 w-40 items-center justify-center rounded-full"
                            style={{
                                background: `conic-gradient(
                  ${statusStyle.ringColor} ${scoreDegrees}deg,
                  #E8EDE8 ${scoreDegrees}deg
                )`,
                            }}
                        >
                            <div className="flex h-[132px] w-[132px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                                <span className="text-6xl font-bold text-[#2F6B3C]">
                                    {analysis.score}
                                </span>

                                <span className="mt-0.5 text-xs font-medium text-gray-500">
                                    Kitchen Health Score
                                </span>
                            </div>
                        </div>

                        <p className="mt-4 font-bold text-[#2F6B3C]">
                            Kitchen Health
                        </p>

                        <span
                            className={`mt-3 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.badgeClassName}`}
                        >
                            {statusStyle.label}
                        </span>

                        <p className="mt-3 text-xs leading-5 text-gray-500">
                            Based on pantry, grocery, planner,
                            recipes and budget activity.
                        </p>
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="space-y-3">
                        {visibleInsights.map((insight) => {
                            const categoryStyle =
                                categoryStyles[
                                insight.category
                                ];

                            const Icon =
                                categoryStyle.icon;

                            return (
                                <article
                                    key={insight.id}
                                    className="rounded-2xl border border-[#EADCC4] bg-[#FFFDF9] p-4 transition hover:border-[#DFC89E] hover:shadow-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${categoryStyle.iconBackgroundClassName} ${categoryStyle.iconClassName}`}
                                        >
                                            <Icon
                                                size={21}
                                                strokeWidth={2}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold leading-6 text-[#2F6B3C]">
                                                {insight.title}
                                            </h3>

                                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                                {insight.message}
                                            </p>

                                            {insight.action && (
                                                <Link
                                                    href={
                                                        insight.action
                                                            .href
                                                    }
                                                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#B9751F] transition hover:text-[#8F5817]"
                                                >
                                                    {
                                                        insight.action
                                                            .label
                                                    }
                                                    <ChevronRight
                                                        size={16}
                                                    />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Link
                            href="/dev/intelligence"
                            className="inline-flex items-center gap-1 rounded-xl border border-[#EADCC4] bg-white px-4 py-2 text-sm font-semibold text-[#5A4032] transition hover:bg-[#FFF8EC]"
                        >
                            View All Insights
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </KBCard>
    );
}