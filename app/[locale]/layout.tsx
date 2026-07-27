import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { locales, isLocale, dirOf, getDict, type Locale } from "@/lib/i18n";
import "../globals.css";


const ebGaramond = EB_Garamond({
  subsets: ["latin", "greek", "greek-ext"],
  variable: "--font-ebgaramond",
  display: "swap",
});

const thmanyahSans = localFont({
  src: [
    { path: "../../public/fonts/thmanyahsans-Light.otf", weight: "300" },
    { path: "../../public/fonts/thmanyahsans-Regular.otf", weight: "400" },
    { path: "../../public/fonts/thmanyahsans-Medium.otf", weight: "500" },
    { path: "../../public/fonts/thmanyahsans-Bold.otf", weight: "700" },
    { path: "../../public/fonts/thmanyahsans-Black.otf", weight: "900" },
  ],
  variable: "--font-thmanyah-sans",
  display: "swap",
});

const thmanyah = localFont({
  src: [
    { path: "../../public/fonts/thmanyahserifdisplay-Light.otf", weight: "300" },
    { path: "../../public/fonts/thmanyahserifdisplay-Regular.otf", weight: "400" },
    { path: "../../public/fonts/thmanyahserifdisplay-Medium.otf", weight: "500" },
    { path: "../../public/fonts/thmanyahserifdisplay-Bold.otf", weight: "700" },
    { path: "../../public/fonts/thmanyahserifdisplay-Black.otf", weight: "900" },
  ],
  variable: "--font-thmanyah-serif",
  display: "swap",
});

const serto = localFont({
  src: "../../public/fonts/serto/SertoAntochBible_2020_Release.ttf",
  variable: "--font-serto",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      languages: { en: "/en", ar: "/ar" },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      dir={dirOf(locale as Locale)}
      className={`${thmanyahSans.variable} ${thmanyah.variable} ${ebGaramond.variable} ${serto.variable}`}
      suppressHydrationWarning
    >
      <body
        className={`${thmanyahSans.variable} ${thmanyah.variable} ${ebGaramond.variable} ${serto.variable} font-sans bg-page text-ink antialiased selection:bg-bronze-500/30 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
