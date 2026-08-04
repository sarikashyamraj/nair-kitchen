"use client";

import { useState } from "react";

import KBButton from "../../components/ui/KBButton";

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
      </div>
    </main>
  );
}