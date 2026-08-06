"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Menu } from "lucide-react";

import MobileMenu from "./MobileMenu";

export default function MobileHeader() {
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  return (
    <>
      <header className="mb-2 flex items-center justify-between gap-3 border-b border-[#F4E8D0] bg-white px-3 py-2.5 md:hidden">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-[#EADCC4] bg-[#FFF8EC] shadow-sm">
            <Image
              src="/branding/kitchen-brain-icon.png"
              alt="Kitchen Brain"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[17px] font-semibold leading-tight text-[#174D2A]">
              Kitchen{" "}
              <span className="text-[#C88A22]">
                Brain
              </span>
            </h2>

            <p className="truncate text-[8px] leading-3 text-gray-500">
              Plan Meals. Shop Smarter. Live Easier.
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            setIsMenuOpen(true)
          }
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EADCC4] bg-[#FFF8EC] text-[#2F6B3C] shadow-sm transition active:scale-95"
        >
          <Menu size={21} />
        </button>
      </header>

      <MobileMenu
        open={isMenuOpen}
        onClose={() =>
          setIsMenuOpen(false)
        }
      />
    </>
  );
}