"use client";

import { useState } from "react";
import { impactTiers } from "@/data/content/content";
import DonateButton from "@/components/ui/DonateButton";
const fmt = (n: number) => n.toLocaleString("en-IN");
const MIN = 500,
  MAX = 25000;
/** Short, warm headline for each tier (keyed by the tier's minimum amount); the original sentence is shown under it. */
const HEADLINE: Record<number, string> = {
  500: "Send a child to school, ready to learn",
  1500: "Nourish 3 families for a whole month",
  2500: "Give 5 children a full year of learning",
  6000: "Change one child's future for good",
  12500: "Bring health care to an entire village",
  20000: "Grow a greener tomorrow for a community"
};
const QUICK = [500, 1000, 2500, 5000, 10000, 25000];
export default function ImpactCalculator() {
  const [amount, setAmount] = useState(2500);
  const outcome = [...impactTiers].reverse().find((t) => amount >= t.min) ?? impactTiers[0];
  const pct = ((amount - MIN) / (MAX - MIN)) * 100;
  return (
    <div className="ic-card relative mx-auto max-w-xl overflow-hidden rounded-3xl bg-white text-ink shadow-2xl ring-1 ring-white/40">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand to-sky-400" />
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/65">Select contribution</p>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-dark">
            INR only
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-brand-light/70 px-5 py-4">
          <p className="text-sm font-medium text-ink/70">Contribution amount</p>
          <p key={amount} className="ic-pop text-4xl font-extrabold tabular-nums text-brand-dark sm:text-5xl">
            ₹{fmt(amount)}
          </p>
        </div>

        <div className="mt-7 px-1">
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={500}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            aria-label="Contribution amount in rupees"
            className="ic-range w-full"
            style={{ ["--p" as string]: `${pct}%` }}
          />
          <div className="mt-2 flex justify-between text-xs font-medium text-ink/65">
            <span>₹ 500</span>
            <span>₹ 12,500</span>
            <span>₹ 25,000</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label="Quick amounts">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              aria-pressed={amount === q}
              onClick={() => setAmount(q)}
              className={`!min-h-0 rounded-full border px-2 py-2 text-sm font-semibold tabular-nums transition ${amount === q ? "border-[#1170c4] bg-[#1170c4] text-white shadow-md shadow-brand/30" : "border-ink/15 bg-white text-ink/70 hover:border-brand/50 hover:bg-brand-light hover:text-brand-dark"}`}
            >
              ₹{fmt(q)}
            </button>
          ))}
        </div>

        <div
          className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a2f5c] via-[#0b4f9c] to-[#1479d1] p-5 text-white shadow-lg shadow-brand/25 sm:p-6"
          aria-live="polite"
        >
          <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 -left-6 h-28 w-28 rounded-full bg-sky-300/10" />
          <div className="relative flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-lg ring-4 ring-white/25"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
            <div className="min-w-0 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-sky-200">Your ₹{fmt(amount)} can</p>
              <p key={outcome.text} className="ic-pop mt-1 text-lg font-bold leading-snug sm:text-xl">
                {HEADLINE[outcome.min] ?? outcome.text}
              </p>
              {HEADLINE[outcome.min] && (
                <p key={`d-${outcome.text}`} className="ic-pop mt-1.5 text-sm leading-relaxed text-white/80">
                  {outcome.text}
                </p>
              )}
            </div>
          </div>
          <div className="relative mt-4 flex items-center gap-3 border-t border-white/15 pt-3">
            <div className="flex gap-1.5" aria-hidden="true">
              {impactTiers.map((tier) => (
                <span
                  key={tier.min}
                  className={`h-1.5 w-6 rounded-full transition-colors ${tier.min <= outcome.min ? "bg-sky-300" : "bg-white/20"}`}
                />
              ))}
            </div>
            <p className="text-xs text-white/70">Every rupee goes further when we give together.</p>
          </div>
        </div>

        <DonateButton to={`/donate?amount=${amount}`} full size="lg" className="mt-6">
          Donate ₹{fmt(amount)} Now
        </DonateButton>
      </div>
      <style>{`
        .ic-range{-webkit-appearance:none;appearance:none;height:6px !important;min-height:0 !important;padding:0 !important;border:0 !important;border-radius:999px;outline:none;cursor:pointer;
          background:linear-gradient(to right,#1479d1 0,#38bdf8 var(--p),#e5ecf5 var(--p),#e5ecf5 100%)}
        .ic-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;height:20px;width:20px;border-radius:50%;background:#fff;border:3px solid #1479d1;box-shadow:0 2px 8px rgba(20,121,209,.4);transition:transform .15s}
        .ic-range::-moz-range-thumb{height:14px;width:14px;border-radius:50%;background:#fff;border:3px solid #1479d1;box-shadow:0 2px 8px rgba(20,121,209,.4)}
        .ic-range:hover::-webkit-slider-thumb,.ic-range:active::-webkit-slider-thumb{transform:scale(1.15)}
        .ic-range:focus-visible{outline:3px solid rgba(20,121,209,.35);outline-offset:6px}
        .ic-card.ic-card .dbtn-solid{color:#fff;background-image:linear-gradient(135deg,#2e9cf0 0%,#1479d1 55%,#0b5cb0 100%);background-color:transparent;box-shadow:0 10px 22px -8px rgba(20,121,209,.7);--dot-a:#7dd3fc;--dot-b:#fff}
        .ic-card.ic-card .dbtn-solid .dbtn-ico{background-color:rgba(255,255,255,.22)}
        .ic-card.ic-card .dbtn-solid:hover{background-color:transparent;box-shadow:0 14px 26px -8px rgba(20,121,209,.75),0 0 0 4px rgba(56,189,248,.25)}
        .ic-pop{animation:icPop .35s ease both}
        @keyframes icPop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.ic-pop{animation:none}}
      `}</style>
    </div>
  );
}
