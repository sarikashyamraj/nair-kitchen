"use client";

import type { LucideIcon } from "lucide-react";

import KBCard from "../ui/KBCard";

interface MealSummaryProps {
    icon: LucideIcon;
    title: string;
    recipeName: string;
}

export default function MealSummary({
    icon: Icon,
    title,
    recipeName,
}: MealSummaryProps) {
    return (
        <KBCard
            padding="comfortable"
            className="h-full"
        >
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF8EC] text-[#2F6B3C]">
                    <Icon size={22} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <p className="mt-1 truncate font-semibold text-[#2F6B3C]">
                        {recipeName}
                    </p>
                </div>
            </div>
        </KBCard>
    );
}