"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/i18n/LangContext";
import DonateButton from "@/components/ui/DonateButton";
import Reveal from "@/components/ui/Reveal";

/** The closing call to donate shown above the footer on every page (the Donate page itself has its own, so it is left out there). */
export default function DonateBanner() {
  const { t } = useLang();
  const pathname = usePathname();
  if (pathname === "/donate") return null;
  return (
    <section className="relative isolate overflow-hidden pb-10 pt-36 text-white sm:pt-40 md:py-12">
      <img
        src="/assets/images/home/hero-slide-opening.webp"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[75%_center] md:object-[center_40%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#061a36]/10 via-[#061a36]/80 to-[#061a36] md:bg-gradient-to-r md:from-[#061a36]/95 md:via-[#0b3d7a]/75 md:to-[#0b4f9c]/30"
      />
      <div className="container-site">
        <Reveal>
          <div className="max-w-3xl max-md:text-center">
            <h2 className="font-serif text-2xl font-bold leading-tight md:text-3xl">
              {t("A small gift can change a whole family's year.")}
            </h2>
            <p className="mt-2 text-sm text-white/85 md:text-base">
              {t("Every rupee is accounted for, and every donor can ask for a receipt.")}
            </p>
            <p className="mt-5 flex flex-wrap gap-3 max-md:justify-center">
              <DonateButton to="/donate">{t("Donate Now")}</DonateButton>
              <Link href="/projects" className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20">
                {t("Our Projects")} <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
