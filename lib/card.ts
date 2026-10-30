export const themeNames = ["cobalt", "ink", "sand", "custom"] as const;
export type CardTheme = (typeof themeNames)[number];

export type CardData = {
  name: string;
  nameKana: string;
  role: string;
  company: string;
  bio: string;
  currentProjects: string;
  pastProjects: string;
  email: string;
  phone: string;
  website: string;
  social: string;
  theme: CardTheme;
  customColor: string;
};

export const defaultCard: CardData = {
  name: "山田 太郎",
  nameKana: "TARO YAMADA",
  role: "Creative Director",
  company: "Studio Ripple",
  bio: "ブランドとプロダクトの、らしさが伝わる体験をつくっています。",
  currentProjects: "ブランドリニューアル／新規プロダクトの立ち上げ",
  pastProjects: "地域文化プロジェクト／D2Cブランドのアートディレクション",
  email: "hello@example.jp",
  phone: "090-1234-5678",
  website: "https://example.jp",
  social: "@taroyamada",
  theme: "cobalt",
  customColor: "#7c3aed",
};

export function initials(name: string) {
  const compact = name.trim().replace(/\s+/g, "");
  return compact.slice(0, 2) || "ME";
}

export function normalizeUrl(value: string) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}
