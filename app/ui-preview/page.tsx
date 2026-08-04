"use client";

import { useState } from "react";

import KBButton from "../../components/ui/KBButton";
import KBCard from "../../components/ui/KBCard";
export default function UIPreviewPage() {
  const [isLoading, setIsLoading] =
    useState(false);

  function testLoadingButton() {
    setIsLoading(true);

    window.setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-2xl border border-[#E8DDC7] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D89B3C]">
            Internal Development Page
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#2F6B3C]">
            Kitchen Brain UI Preview
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            This page is used to review and test reusable
            Kitchen Brain design-system components before
            they are introduced into production screens.
          </p>
        </header>

        <section className="rounded-2xl border border-[#E8DDC7] bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-[#2F6B3C]">
              KBButton
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review variants, sizes, loading states,
              disabled behaviour and full-width rendering.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-[#5A4032]">
                Variants
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                <KBButton variant="primary">
                  Primary
                </KBButton>

                <KBButton variant="secondary">
                  Secondary
                </KBButton>

                <KBButton variant="success">
                  Success
                </KBButton>

                <KBButton variant="warning">
                  Warning
                </KBButton>

                <KBButton variant="danger">
                  Danger
                </KBButton>

                <KBButton variant="ghost">
                  Ghost
                </KBButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#5A4032]">
                Sizes
              </h3>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <KBButton size="sm">
                  Small
                </KBButton>

                <KBButton size="md">
                  Medium
                </KBButton>

                <KBButton size="lg">
                  Large
                </KBButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#5A4032]">
                Icons
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                <KBButton
                  icon={
                    <span className="text-base">
                      💾
                    </span>
                  }
                >
                  Save
                </KBButton>

                <KBButton
                  variant="success"
                  icon={
                    <span className="text-base">
                      🛒
                    </span>
                  }
                >
                  Generate Grocery
                </KBButton>

                <KBButton
                  variant="danger"
                  icon={
                    <span className="text-base">
                      🗑️
                    </span>
                  }
                >
                  Delete
                </KBButton>

                <KBButton
                  variant="secondary"
                  icon={
                    <span className="text-base">
                      →
                    </span>
                  }
                  iconPosition="right"
                >
                  Continue
                </KBButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#5A4032]">
                Loading and Disabled
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                <KBButton
                  loading={isLoading}
                  loadingText="Saving..."
                  onClick={testLoadingButton}
                >
                  Test Loading
                </KBButton>

                <KBButton disabled>
                  Disabled
                </KBButton>

                <KBButton
                  variant="danger"
                  disabled
                >
                  Disabled Danger
                </KBButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#5A4032]">
                Full Width
              </h3>

              <div className="mt-4 max-w-md space-y-3">
                <KBButton fullWidth>
                  Save Settings
                </KBButton>

                <KBButton
                  variant="secondary"
                  fullWidth
                >
                  Cancel
                </KBButton>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#5A4032]">
                Native HTML Props
              </h3>

              <div className="mt-4 flex flex-wrap gap-3">
                <KBButton
                  title="Hover title example"
                  aria-label="Example accessible action"
                  onClick={() => {
                    window.alert(
                      "KBButton click test passed."
                    );
                  }}
                >
                  Test Click
                </KBButton>

                <KBButton
                  type="submit"
                  variant="secondary"
                >
                  Submit Type
                </KBButton>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E8DDC7] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#2F6B3C]">
            KBButton Acceptance Checklist
          </h2>

          <div className="mt-4 grid gap-3 text-sm text-[#5A4032] sm:grid-cols-2">
            {[
              "All six variants render correctly",
              "Small, medium and large sizes work",
              "Left and right icons align correctly",
              "Loading spinner and loading text work",
              "Disabled buttons cannot be clicked",
              "Full-width buttons fill the container",
              "Keyboard focus is visible",
              "Enter and Space activate the button",
              "Mobile layout wraps without overflow",
              "No console or TypeScript errors",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[#F0E4CF] bg-[#FFFDF8] px-4 py-3"
              >
                □ {item}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-[#E8DDC7] bg-white p-6 shadow-sm">
  <div>
    <h2 className="text-2xl font-bold text-[#2F6B3C]">
      KBCard
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Review card variants, padding, structured content,
      actions, loading, selection and interactive behaviour.
    </p>
  </div>

  <div className="mt-8 grid gap-6 lg:grid-cols-2">
    <KBCard
      title="Default Card"
      subtitle="General information container"
    >
      <p className="text-sm leading-6 text-gray-600">
        This is the default Kitchen Brain card used for
        standard page content.
      </p>
    </KBCard>

    <KBCard
      variant="outlined"
      title="Outlined Card"
      subtitle="Suitable for forms and settings"
      icon={<span>⚙️</span>}
    >
      <p className="text-sm leading-6 text-gray-600">
        The outlined variant has no elevation and keeps the
        interface visually light.
      </p>
    </KBCard>

    <KBCard
      variant="elevated"
      title="Elevated Card"
      subtitle="Suitable for important dashboard content"
      icon={<span>📊</span>}
      badge={
        <span className="rounded-full bg-[#EAF5EC] px-3 py-1 text-xs font-semibold text-[#2F6B3C]">
          Healthy
        </span>
      }
      footer="Updated today"
    >
      <p className="text-3xl font-bold text-[#2F6B3C]">
        92%
      </p>

      <p className="mt-1 text-sm text-gray-500">
        Kitchen health score
      </p>
    </KBCard>

    <KBCard
      variant="interactive"
      title="Interactive Card"
      subtitle="Click or use Enter and Space"
      icon={<span>🥫</span>}
      onClick={() => {
        window.alert(
          "Interactive KBCard test passed."
        );
      }}
      actions={
        <>
          <KBButton size="sm">
            Open Pantry
          </KBButton>

          <KBButton
            size="sm"
            variant="secondary"
          >
            View Details
          </KBButton>
        </>
      }
    >
      <p className="text-sm leading-6 text-gray-600">
        Interactive cards provide hover, keyboard and focus
        behaviour.
      </p>
    </KBCard>

    <KBCard
      title="Selected Card"
      subtitle="Represents the active selection"
      selected
      icon={<span>✓</span>}
    >
      <p className="text-sm text-gray-600">
        This card is currently selected.
      </p>
    </KBCard>

    <KBCard
      title="Disabled Card"
      subtitle="Unavailable interaction"
      variant="interactive"
      disabled
      onClick={() => {
        window.alert(
          "This should not appear."
        );
      }}
    >
      <p className="text-sm text-gray-600">
        This card should not respond to clicks or keyboard
        activation.
      </p>
    </KBCard>

    <KBCard
      padding="compact"
      title="Compact Padding"
      subtitle="For dense information"
    >
      <p className="text-sm text-gray-600">
        Compact cards use less internal spacing.
      </p>
    </KBCard>

    <KBCard
      padding="spacious"
      title="Spacious Padding"
      subtitle="For featured content"
    >
      <p className="text-sm leading-6 text-gray-600">
        Spacious cards provide additional breathing room for
        important or promotional content.
      </p>
    </KBCard>

    <KBCard loading />

    <KBCard
      title="Image Card"
      subtitle="Prepared for future recipe imagery"
      image={
        <div className="flex h-40 items-center justify-center bg-[#FFF6E3] text-5xl">
          🍲
        </div>
      }
      footer="Recipe preview"
    >
      <p className="text-sm text-gray-600">
        Image support will later be used by Recipes and AI
        recommendations.
      </p>
    </KBCard>
  </div>
</section>

<section className="rounded-2xl border border-[#E8DDC7] bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold text-[#2F6B3C]">
    KBCard Acceptance Checklist
  </h2>

  <div className="mt-4 grid gap-3 text-sm text-[#5A4032] sm:grid-cols-2">
    {[
      "All four variants render correctly",
      "Compact, comfortable and spacious padding work",
      "Icon, title, subtitle and badge align correctly",
      "Actions and footer render correctly",
      "Loading skeleton displays correctly",
      "Selected state is clearly visible",
      "Disabled card cannot be activated",
      "Interactive card works with mouse",
      "Enter and Space activate interactive cards",
      "Mobile layout has no horizontal overflow",
    ].map((item) => (
      <div
        key={item}
        className="rounded-xl border border-[#F0E4CF] bg-[#FFFDF8] px-4 py-3"
      >
        □ {item}
      </div>
    ))}
  </div>
</section>
      </div>
    </main>
  );
}