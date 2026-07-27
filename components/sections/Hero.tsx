import Image from "next/image";
import { Button, TwoTone } from "../ui";
import RotatingAncientText from "@/components/ui/RotatingAncientText";
import type { Dict } from "@/lib/i18n";
import DottedBackground from "@/components/ui/DottedBackground";

export default function Hero({ dict }: { dict: Dict }) {
  const t = dict.hero;
  return (
    <section id="top" className="relative isolate overflow-clip">
      
      {/* Dot Matrix Background */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none" 
        aria-hidden="true"
        style={{
          maskImage: "radial-gradient(ellipse at center, transparent 15%, black 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 15%, black 60%)"
        }}
      >
        <DottedBackground 
          bgColor="#ffffff"
          frequency={1.5}
          speed={2}
          cellSize={6}
          gamma={7}
          paletteBias={-5}
          colors={[
            "#E7EDF4",
            "#C9D6F4",
            "#A4BAEC",
            "#6F8FDD",
            "#21386E",
            "#1C315F",
            "#17294F",
            "#121F3D"
          ]}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1280px] flex-col justify-center px-6 pb-14 pt-[71px]">
        
        {/* Figma Layout */}
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          
          <div className="flex flex-col gap-[40px] items-center justify-center relative shrink-0 w-full" data-reveal>
            
            <div className="flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-full">

              <div className="flex flex-col gap-[32px] items-center justify-center relative shrink-0 w-full">
                <div className="bg-[#f4f4f5] border border-[#d4d4d8] h-[36px] flex gap-[8px] items-center px-[17px] py-[4px] relative rounded-[100px]" data-reveal-item>
                  <div className="relative flex size-[10px] shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-[#FFD8BA] opacity-75"></span>
                    <span className="relative inline-flex size-[10px] rounded-full bg-[#EE8D43]"></span>
                  </div>
                  <p className="font-display font-medium text-[16px] text-[#71717a] text-center whitespace-nowrap" dir="auto" style={{ fontFeatureSettings: '"swsh"' }}>
                    منصة أكاديمية لدراسة التراث المسيحي
                  </p>
                </div>
                
                <h1 className="font-display font-bold whitespace-nowrap leading-[normal] min-w-full text-[48px] text-[#17294F] text-center" dir="auto" style={{ fontFeatureSettings: '"swsh"' }} data-reveal-item>
                  من النصوص الأصلية إلى دراســة أعمق
                </h1>
              </div>
              
              <p className="font-sans font-normal text-[20px] text-[#71717a] text-center w-full max-w-[744px] leading-[1.5]" dir="auto" data-reveal-item>
                استكشف كتابات آباء الكنيسة بلغاتها الأصلية، وقارن الترجمات، وابحث داخل آلاف النصوص، واستفد من أدوات تحليل متقدمة في منصة واحدة صُممت للباحثين والدارسين.
              </p>

            </div>
            
            <div className="flex flex-wrap gap-[16px] items-center justify-center relative shrink-0 w-full" data-reveal-item>
              <a href="#pricing" className="bg-[#21386E] flex gap-[16px] items-center justify-center pl-[16px] pr-[24px] py-[12px] h-[56px] rounded-[12px] transition-colors hover:bg-[#17294f]">
                <span className="font-sans font-medium text-[#fefefe] text-[20px] whitespace-nowrap" style={{ fontFeatureSettings: '"swsh"' }}>
                  ابـــــدأ الآن
                </span>
                <Image src="/images/primary-btn-icon.png" alt="Icon" width={32} height={32} />
              </a>
              <a href="#pillars" className="border-2 border-[#21386E] flex h-[56px] items-center justify-center px-[24px] py-[12px] rounded-[12px] transition-colors hover:bg-[#21386E]/5">
                <span className="font-sans font-medium text-[20px] text-[#21386E] whitespace-nowrap" style={{ fontFeatureSettings: '"swsh"' }}>
                  تواصـل معـنا
                </span>
              </a>
            </div>

          </div>

        </div>


      </div>
    </section>
  );
}
