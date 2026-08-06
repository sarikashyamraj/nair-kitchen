export const kitchenTheme = {
  colors: {
    background: "#FFFDF8",
    surface: "#FFFFFF",

    primary: "#2F6B3C",
    primaryDark: "#245B32",
    primarySoft: "#EAF5EC",

    brandGold: "#D89B3C",
    brandGoldSoft: "#FFF4DD",

    warning: "#C47A00",
    warningSoft: "#FFF8E1",

    danger: "#DC2626",
    dangerSoft: "#FEF2F2",

    info: "#2563EB",
    infoSoft: "#EFF6FF",

    textPrimary: "#5A4032",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",

    border: "#EADCC4",
    borderSoft: "#F4E8D0",
  },

  radius: {
    card: "20px",
    panel: "16px",
    control: "14px",
    badge: "999px",
    circular: "999px",
  },

  shadow: {
    card:
      "0 2px 8px rgba(90, 64, 50, 0.08)",
    dialog:
      "0 16px 40px rgba(47, 107, 60, 0.18)",
    floating:
      "0 10px 24px rgba(47, 107, 60, 0.28)",
  },

  spacing: {
    screenX: "16px",
    screenY: "16px",
    section: "16px",
    card: "16px",
    compact: "12px",
  },

  typography: {
    heroValue: "28px",
    sectionTitle: "22px",
    cardTitle: "18px",
    body: "16px",
    secondary: "13px",
    caption: "12px",
  },

  motion: {
    fast: "180ms",
    standard: "240ms",
    slow: "300ms",
  },

  zIndex: {
    header: 40,
    bottomNavigation: 50,
    fab: 60,
    modal: 100,
  },
} as const;

export type KitchenTheme =
  typeof kitchenTheme;