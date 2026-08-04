import type { LucideIcon } from "lucide-react";

import {
  Apple,
  Beef,
  Bell,
  CalendarDays,
  Camera,
  ChefHat,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  CircleX,
  Clock3,
  Coffee,
  CookingPot,
  Cookie,
  Croissant,
  CupSoda,
  Eye,
  EyeOff,
  Filter,
  Fish,
  HeartPulse,
  House,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Milk,
  Minus,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ScanBarcode,
  Search,
  Settings as SettingsIcon,
  ShoppingCart,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Sunrise,
  Trash2,
  TriangleAlert,
  UserRound,
  UsersRound,
  UtensilsCrossed,
  WalletCards,
  Wheat,
X,
} from "lucide-react";

/**
 * Central icon registry for Kitchen Brain.
 *
 * Production screens should use icons from this registry instead
 * of importing Lucide icons directly. This keeps icon choices
 * consistent and allows app-wide changes from one file.
 */
export const KBIcons = {
  navigation: {
    dashboard: LayoutDashboard,
    pantry: Package,
    grocery: ShoppingCart,
    recipes: ChefHat,
    planner: CalendarDays,
    budget: WalletCards,
    profile: UserRound,
    settings: SettingsIcon,
  },

  actions: {
    add: CirclePlus,
    plus: Plus,
    minus: Minus,
    edit: Pencil,
    delete: Trash2,
    save: Save,
    search: Search,
    filter: Filter,
    refresh: RefreshCw,
    confirm: Check,
    close: X,
    back: ChevronLeft,
    forward: ChevronRight,
    menu: Menu,
    logout: LogOut,
    show: Eye,
    hide: EyeOff,
    camera: Camera,
    barcode: ScanBarcode,
  },

  feedback: {
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleX,
    info: CircleAlert,
    notification: Bell,
  },

  kitchen: {
    health: HeartPulse,
    ai: Sparkles,
    household: UsersRound,
    home: House,
    cooking: CookingPot,
    time: Clock3,
    
    preferences: SlidersHorizontal,
  },

  meals: {
    morningDrink: Coffee,
    breakfast: Sunrise,
    lunch: UtensilsCrossed,
    snack: Apple,
    dinner: ChefHat,
  },

  pantryCategories: {
    dairy: Milk,
    vegetables: Leaf,
    fruits: Apple,
    meat: Beef,
    seafood: Fish,
    bakery: Croissant,
    frozen: Snowflake,
    beverages: CupSoda,
    household: House,
    spices: CookingPot,
    grains: Wheat,
    snacks: Cookie,
    grocery: ShoppingCart,
    other: Package,
  },
} satisfies Record<
  string,
  Record<string, LucideIcon>
>;

export const KBIconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
} as const;

export type KBIconSizeName =
  keyof typeof KBIconSize;

export type KBIconComponent =
  LucideIcon;