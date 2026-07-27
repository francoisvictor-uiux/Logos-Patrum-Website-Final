import { en } from "./en";
import type { Locale } from "./config";

export type Dict = typeof en;

export async function getDict(locale: Locale): Promise<Dict> {
  if (locale === "ar") {
    const { ar } = await import("./ar");
    return ar;
  }
  return en;
}

export { locales, defaultLocale, isLocale, dirOf, type Locale } from "./config";
