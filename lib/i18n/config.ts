export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
// Arabic-first: the platform's primary market. Root redirects to /ar.
export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
