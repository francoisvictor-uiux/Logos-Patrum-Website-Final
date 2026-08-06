import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/lib/i18n";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Pillars from "@/components/sections/Pillars";
import Workspace from "@/components/sections/Workspace";
import Why from "@/components/sections/Why";
import Library from "@/components/sections/Library";
import ResearchJourney from "@/components/sections/ResearchJourney";
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
      <Preloader dict={dict} />
      <Header dict={dict} locale={locale} />
      <SmoothScroll>
        <main>
          {/* Guide narrative: what it is (02) → how it works (03) → what is in
              it (04) → what using it is like (05) → why it's different →
              trust → convert.

              03 and 05 both show the workspace, and on purpose: 03 is the
              tour, 05 is the story. The tour earns the reader's belief that
              the parts exist; the story shows what it feels like to move
              between them. 04 sits between the two so the second surface
              arrives as a return rather than as a repeat. */}
          <Hero dict={dict} />
          <Pillars dict={dict} />
          <Workspace dict={dict} />
          <Library dict={dict} locale={locale} />
          <ResearchJourney dict={dict} locale={locale} />
          <Preview dict={dict} />
          <Features dict={dict} />
          <Workflow dict={dict} />
          <Why dict={dict} />
          <Story dict={dict} />
          <Security dict={dict} />
          <Stats dict={dict} locale={locale} />
          <Partners dict={dict} />
          <Testimonials dict={dict} />
          <Pricing dict={dict} />
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
