"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { site, societyReg, darpanId, reg12A, reg80G, fcraReg } from "@/config/site";
import { subscribeNewsletter, type NewsletterResult } from "@/services/forms";
import { useLang } from "@/i18n/LangContext";
import { quickNav } from "@/config/navigation";
import { checkField } from "@/utils/validate";
import SocialIcons from "@/components/ui/SocialIcons";
import { env } from "@/lib/env";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { t } = useLang();
  const [emailErr, setEmailErr] = useState("");
  const [state, setState] = useState<"idle" | "sending" | NewsletterResult | "error">("idle");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const m = checkField("email", email, true);
    setEmailErr(m);
    if (m) return;
    setState("sending");
    try {
      const r = await subscribeNewsletter(email);
      setState(r);
      if (r === "sent") setEmail("");
    } catch {
      setState("error");
    }
  };
  return (
    <footer className="bg-ink text-sm text-white/80">
      {/* on large screens all four columns are the same height and the last item of each (Donate Now, the social icons, the fax line, Subscribe) sits on the same line */}
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 md:py-14 lg:grid-cols-4">
        <div className="flex flex-col">
          <Link
            href="/"
            aria-label={`${site.name} home`}
            className="inline-block self-start rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/20 transition hover:scale-[1.03]"
          >
            <img src="/assets/images/logo.png" alt={`${site.name} logo`} className="h-14 w-auto max-w-[230px] object-contain" />
          </Link>
          <p className="mt-3 text-xs">
            {site.name} · {site.location} · {site.regLine}
          </p>
          <p className="mt-4 text-xs">Society Reg: {societyReg}</p>
          <p className="text-xs">Darpan ID: {darpanId}</p>
          <p className="text-xs">12A: {reg12A.value}</p>
          <p className="text-xs">80G: {reg80G.value}</p>
          <p className="text-xs">FCRA: {fcraReg.value}</p>
          <p className="text-xs">
            <Link href="/transparency?request=certificate#request" className="no-underline hover:text-white">
              Request registration certificates
            </Link>
          </p>
          <SocialIcons className="mt-5 lg:mt-auto lg:pt-5" />
        </div>
        <div className="flex flex-col">
          <h3 className="mb-3 font-semibold text-white">{t("Quick Navigation")}</h3>
          <ul className="space-y-2 lg:flex lg:flex-1 lg:flex-col lg:justify-between">
            {quickNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="no-underline hover:text-white">
                  {t(l.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-3 font-semibold text-white">{t("Field Office & Contact")}</h3>
          {/* the spare height is shared equally between the four blocks, so the last one still ends on the bottom line */}
          <div className="flex flex-1 flex-col gap-2 lg:justify-between">
            <p>{site.address}</p>
            <div>
              <p>
                <a href={site.phoneHref} className="inline-block py-1 hover:text-white">
                  Phone: {site.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="inline-block py-1 hover:text-white">
                  Email: {site.email}
                </a>
              </p>
            </div>
            <p>Office Hours: {site.officeHours}</p>
            <p>
              Chairman: {site.chairman} · Fax: {site.fax}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-3 font-semibold text-white">{t("Field Updates Newsletter")}</h3>
          <p>Receive monthly impact reports, field stories, and upcoming drive announcements.</p>
          <form onSubmit={submit} noValidate className="mt-3 flex flex-1 flex-col gap-2">
            <label htmlFor="nl-email" className="text-xs">
              Email
            </label>
            <input
              id="nl-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailErr) setEmailErr("");
              }}
              aria-invalid={!!emailErr || state === "invalid"}
              aria-describedby={emailErr ? "nl-email-err" : undefined}
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-md bg-white/10 px-3 py-2.5 text-white placeholder-white/50"
            />
            {emailErr && (
              <p id="nl-email-err" className="text-xs text-red-300">
                {emailErr}
              </p>
            )}
            <button className="btn btn-primary w-full disabled:opacity-60 lg:mt-auto" type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Subscribing..." : t("Subscribe to Updates")}
            </button>
            <div role="status" aria-live="polite" className="text-xs empty:hidden">
              {state === "sent" && <p className="text-green-300">Thank you for subscribing to our updates!</p>}
              {state === "already" && <p className="text-green-300">You are already subscribed to our updates.</p>}
              {state === "mailto" && <p className="text-green-300">Your email app should open. Press Send to finish.</p>}
              {state === "invalid" && <p className="text-red-300">Please enter a valid email address.</p>}
              {state === "limited" && <p className="text-red-300">Too many attempts. Please try again in a few minutes.</p>}
              {state === "error" && <p className="text-red-300">Something went wrong. Please try again.</p>}
            </div>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center gap-4 pb-24 pt-4 text-center text-xs md:pb-4 md:pl-44 md:pr-24 2xl:flex-row 2xl:justify-between 2xl:gap-8 2xl:pl-6 2xl:pr-6 2xl:text-left">
          <div className="flex w-full max-w-[17rem] flex-col gap-2 sm:w-auto sm:max-w-none sm:flex-row md:order-last 2xl:shrink-0">
            <a
              href={site.googleBusiness}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 font-semibold text-brand-dark shadow transition hover:bg-brand-light"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-red-500" fill="currentColor">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              Find us on Google
            </a>
            <a
              href={site.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-2 font-semibold text-brand-dark shadow transition hover:bg-brand-light"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 text-amber-500" fill="currentColor">
                <path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5Z" />
              </svg>
              Review us on Google
            </a>
          </div>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 2xl:flex-col 2xl:items-start 2xl:justify-start">
            <span className="whitespace-nowrap">
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name}. All rights reserved.
            </span>
            <span className="whitespace-nowrap text-white/70">Developed by Scalric</span>
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 2xl:flex-nowrap 2xl:whitespace-nowrap">
            <Link href="/privacy" className="no-underline hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="no-underline hover:text-white">
              Terms of Use
            </Link>
            <Link href="/dpdp" className="no-underline hover:text-white">
              DPDP Compliance Notice
            </Link>
            {env.adminUrl && (
              <a href={env.adminUrl} rel="nofollow" className="no-underline hover:text-white">
                Admin
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
