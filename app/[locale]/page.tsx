import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Pillars from "@/components/sections/Pillars";
import Why from "@/components/sections/Why";
import Filters from "@/components/sections/Filters";
import Preview from "@/components/sections/Preview";
import Features from "@/components/sections/Features";
import Workflow from "@/components/sections/Workflow";
import Story from "@/components/sections/Story";
import Security from "@/components/sections/Security";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import Partners from "@/components/sections/Partners";
import News from "@/components/sections/News";
import Faq from "@/components/sections/Faq";
import Newsletter from "@/components/sections/Newsletter";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/Footer";
import HeroIntro from "@/components/sections/HeroIntro";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDict(locale);

  return (
    <>
      <Header dict={dict} locale={locale} />
      <SmoothScroll>
        <main>
          <Hero dict={dict} />
          <HeroIntro />
          <Pillars dict={dict} />
          <Why dict={dict} />
          <Filters dict={dict} />
          <Preview dict={dict} />
          <Features dict={dict} />
          <Workflow dict={dict} />
          <Story dict={dict} />
          <Security dict={dict} />
          <Stats dict={dict} locale={locale} />
          <Testimonials dict={dict} />
          <Pricing dict={dict} />
          <Partners dict={dict} />
          <News dict={dict} />
          <Faq dict={dict} />
          <Newsletter dict={dict} />
          <FinalCta dict={dict} />
        </main>
        <Footer dict={dict} locale={locale} />
      </SmoothScroll>
    </>
  );
}
