"use client";

import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import BottomSheet from "../../components/ui/BottomSheet";

export default function TestBottomSheetPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#2F6B3C]">
          Bottom Sheet Test
        </h1>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-[#2F6B3C] px-6 py-3 font-semibold text-white hover:bg-[#255730]"
        >
          Open Bottom Sheet
        </button>

        <BottomSheet
          isOpen={isOpen}
          title="Shopping Summary"
          onClose={() => setIsOpen(false)}
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              🎉 Congratulations! Your reusable Bottom Sheet is working.
            </p>

            <div className="rounded-xl border border-[#EADCC4] bg-[#FFF8EC] p-4">
              <h3 className="font-semibold text-[#5A4032]">
                Test Content
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                This is placeholder content. Later, this area will contain the
                Shopping Summary form.
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full rounded-xl bg-[#2F6B3C] py-3 font-semibold text-white"
            >
              Close Sheet
            </button>
          </div>
        </BottomSheet>
      </div>
    </AppLayout>
  );
}