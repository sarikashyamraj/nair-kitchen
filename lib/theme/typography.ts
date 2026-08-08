export const typography = {
  /**
   * PAGE
   * Main module title.
   * Example: Home Inventory, Grocery, Recipes
   */
  pageTitle:
    "text-[21px] sm:text-2xl font-bold tracking-[-0.025em] leading-tight",

  /**
   * EYEBROW
   * Small label above a page title.
   * Example: KITCHEN BRAIN, HOME INVENTORY
   */
  eyebrow:
    "text-[10px] font-semibold uppercase tracking-[0.16em]",

  /**
   * PAGE DESCRIPTION
   * Supporting sentence below page title.
   */
  pageDescription:
    "text-[12px] sm:text-[13px] font-normal leading-5",

  /**
   * SECTION TITLE
   * Example: Categories, Needs Attention, Items
   */
  sectionTitle:
    "text-[16px] sm:text-[17px] font-semibold tracking-[-0.015em] leading-tight",

  /**
   * CARD TITLE
   * Example: Inventory Health, Grains, Dairy
   */
  cardTitle:
    "text-[14px] sm:text-[15px] font-semibold tracking-[-0.01em] leading-5",

  /**
   * ITEM TITLE
   * Example: Rice, Milk, Eggs
   */
  itemTitle:
    "text-[15px] sm:text-base font-semibold tracking-[-0.01em] leading-5",

  /**
   * BODY
   */
  body:
    "text-[12px] sm:text-[13px] font-normal leading-5",

  /**
   * BODY MEDIUM
   * Slight emphasis without bold text.
   */
  bodyMedium:
    "text-[12px] sm:text-[13px] font-medium leading-5",

  /**
   * CAPTION
   * Counts, helper text, secondary information.
   */
  caption:
    "text-[10.5px] sm:text-[11px] font-normal leading-4",

  /**
   * LABEL
   * Available, Minimum, Category etc.
   */
  label:
    "text-[10px] sm:text-[11px] font-medium leading-4",

  /**
   * STATUS / BADGE
   */
  badge:
    "text-[10px] font-semibold leading-none",

  /**
   * BUTTON
   */
  button:
    "text-[13px] sm:text-sm font-semibold",

  /**
   * STAT
   * Inventory totals and dashboard numbers.
   */
  stat:
    "text-[20px] sm:text-2xl font-semibold tracking-[-0.025em] leading-none",

  /**
   * HERO STAT
   * Example: Inventory Health 65%
   */
  heroStat:
    "text-[28px] sm:text-3xl font-bold tracking-[-0.035em] leading-none",
} as const;