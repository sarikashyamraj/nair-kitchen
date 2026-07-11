"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

import { UserProfile } from "../../types/profile";
import { defaultUserProfile } from "../../data/defaultProfile";
import { loadUserProfile } from "../../lib/profileStorage";
import { useKitchen } from "../../context/KitchenContext";

export default function TopHeader() {
  const { pantry, shopping, planner } = useKitchen();

  const [profile, setProfile] =
    useState<UserProfile>(defaultUserProfile);

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  const notificationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function refreshProfile() {
      setProfile(loadUserProfile());
    }

    refreshProfile();

    window.addEventListener(
      "profile-updated",
      refreshProfile
    );

    return () => {
      window.removeEventListener(
        "profile-updated",
        refreshProfile
      );
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node
        )
      ) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const formattedDate = now.toLocaleDateString("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const currentDay = now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const lowStockItems = pantry.filter(
    (item) => item.quantity <= item.minQuantity
  );

  const pendingGroceryItems = shopping.filter(
    (item) => !item.purchased
  );

  const todaysPlan = [...planner]
    .reverse()
    .find((plan) => plan.day === currentDay);

  const mealSlots = [
    todaysPlan?.morningDrink,
    todaysPlan?.breakfast,
    todaysPlan?.lunch,
    todaysPlan?.snack,
    todaysPlan?.dinner,
  ];

  const unplannedMealCount = mealSlots.filter(
    (recipeId) => !recipeId
  ).length;

  const notifications = [
    {
      id: "pantry",
      show: lowStockItems.length > 0,
      title: `${lowStockItems.length} pantry item${
        lowStockItems.length === 1 ? " is" : "s are"
      } running low`,
      description: lowStockItems
        .slice(0, 3)
        .map((item) => item.name)
        .join(", "),
      href: "/pantry",
      emoji: "🥫",
    },
    {
      id: "grocery",
      show: pendingGroceryItems.length > 0,
      title: `${pendingGroceryItems.length} grocery item${
        pendingGroceryItems.length === 1 ? "" : "s"
      } pending`,
      description: "Open your grocery list to continue shopping.",
      href: "/grocery",
      emoji: "🛒",
    },
    {
      id: "planner",
      show: unplannedMealCount > 0,
      title: `${unplannedMealCount} meal${
        unplannedMealCount === 1 ? "" : "s"
      } not planned today`,
      description: `Complete your ${currentDay} meal plan.`,
      href: "/planner",
      emoji: "📅",
    },
  ].filter((notification) => notification.show);

  const notificationCount = notifications.length;

  return (
    <header className="mb-6 rounded-2xl border border-[#F4E8D0] bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5 lg:mb-8 lg:px-8 lg:py-6">
      <div className="flex items-center justify-between gap-3">
        {/* Greeting and Date */}
        <div className="min-w-0">
          <h1 className="text-xl font-bold leading-tight text-[#2F6B3C] sm:text-3xl">
            {greeting}, {profile.name} 👋
          </h1>

          <p className="mt-1 text-xs text-[#6B7280] sm:text-base">
            {formattedDate}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* Notification Bell */}
          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={isNotificationsOpen}
              onClick={() =>
                setIsNotificationsOpen(
                  (currentValue) => !currentValue
                )
              }
              className="relative rounded-xl p-2 transition hover:bg-[#F4E8D0] sm:p-3"
            >
              <Bell size={21} />

              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D89B3C] px-1 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[300px] overflow-hidden rounded-2xl border border-[#EADCC4] bg-white shadow-xl sm:w-[340px]">
                <div className="border-b border-[#F4E8D0] px-4 py-3">
                  <h2 className="font-bold text-[#2F6B3C]">
                    Notifications
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {notificationCount > 0
                      ? `${notificationCount} area${
                          notificationCount === 1
                            ? ""
                            : "s"
                        } need attention.`
                      : "Everything is up to date."}
                  </p>
                </div>

                {notificationCount === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-2xl">✅</p>

                    <p className="mt-2 font-semibold text-[#2F6B3C]">
                      All caught up
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      No kitchen alerts right now.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        href={notification.href}
                        onClick={() =>
                          setIsNotificationsOpen(false)
                        }
                        className="flex gap-3 border-b border-[#F4E8D0] px-4 py-3 transition last:border-b-0 hover:bg-[#FFF8EC]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF4DD] text-lg">
                          {notification.emoji}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#5A4032]">
                            {notification.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {notification.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <Link
            href="/profile"
            aria-label="Open profile"
            className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-[#FFF8EC] sm:gap-3 sm:p-2"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#D89B3C] bg-[#F4E8D0] shadow-sm sm:h-12 sm:w-12">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={`${profile.name} profile`}
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-bold text-[#2F6B3C]">
                  {profile.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="hidden text-left lg:block">
              <p className="font-semibold leading-tight text-[#5A4032]">
                {profile.name}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {profile.role}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}