"use client";

import { useRef, useState } from "react";
import { bankAccounts, site, type BankAccount } from "@/config/site";
import { useLang } from "@/i18n/LangContext";

/** Only the SBI card has a button: the Razorpay page. The other cards just show their bank details. */
const actions: Partial<Record<string, { label: string; href: string; external?: boolean }>> = {
  sbi: { label: "Pay Through Razorpay", href: site.razorpayMe, external: true }
};

interface Field {
  key: string;
  label: string;
  value: string;
  /** a number the donor will want to paste into a banking app: gets a Copy button */
  copy?: boolean;
}

function fieldsOf(a: BankAccount): Field[] {
  return [
    { key: "name", label: "Account Name", value: a.accountName },
    { key: "number", label: "Account Number", value: a.accountNumber, copy: true },
    { key: "ifsc", label: "IFSC", value: a.ifsc, copy: true },
    ...(a.swift ? [{ key: "swift", label: "SWIFT/BIC", value: a.swift, copy: true }] : []),
    { key: "branch", label: "Branch", value: a.branch }
  ];
}

/** Copies text to the clipboard. Falls back to the older method where the modern one is not allowed (e.g. a page not served over https). */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* try the older way below */
  }
  try {
    const box = document.createElement("textarea");
    box.value = text;
    box.setAttribute("readonly", "");
    box.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(box);
    box.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(box);
    return ok;
  } catch {
    return false;
  }
}

function BankIcon({ foreign }: { foreign: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${foreign ? "bg-rose-50 text-rose-600" : "bg-brand-light text-brand"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {foreign ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.6 2.7 4 5.7 4 9s-1.4 6.3-4 9c-2.6-2.7-4-5.7-4-9s1.4-6.3 4-9z" />
          </>
        ) : (
          <path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />
        )}
      </svg>
    </span>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  className: "h-3.5 w-3.5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true
} as const;

function Card({ account, className = "" }: { account: BankAccount; className?: string }) {
  const { t } = useLang();
  const [copied, setCopied] = useState("");
  const valueRefs = useRef<Record<string, HTMLElement | null>>({});
  const timer = useRef(0);
  const foreign = account.kind === "foreign";
  const action = actions[account.id];
  const fields = fieldsOf(account);

  const copy = async (f: Field) => {
    window.clearTimeout(timer.current);
    if (await copyText(f.value)) {
      setCopied(f.key);
      timer.current = window.setTimeout(() => setCopied(""), 2000);
    } else {
      // could not copy: select the number so the donor can press Ctrl+C or long-press it
      const el = valueRefs.current[f.key];
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };
  const done = fields.find((f) => f.key === copied);

  return (
    <article
      className={`flex h-full flex-col rounded-3xl bg-white p-6 shadow-[0_10px_40px_-12px_rgba(11,79,156,.25)] sm:p-7 ${foreign ? "ring-2 ring-rose-300" : "ring-1 ring-brand/10"} ${className}`}
    >
      <p
        className={`inline-flex self-start rounded-full px-4 py-1.5 text-xs font-semibold ${foreign ? "bg-rose-50 text-rose-700" : "bg-brand-light text-brand-dark"}`}
      >
        {foreign ? t("Foreign Contributions Only") : t("Indian Donations")}
      </p>
      {/* a fixed minimum height keeps the details of all three cards level, whether the bank name takes one line or two */}
      <h3 className="mt-4 flex min-h-[2.75rem] items-center gap-3 text-lg font-extrabold leading-tight tracking-tight text-ink">
        <BankIcon foreign={foreign} />
        {t(account.bank)}
      </h3>

      <ul className="mt-4 divide-y divide-ink/10 border-t border-ink/10">
        {fields.map((f) => (
          <li key={f.key} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink/55">{t(f.label)}</p>
              <p
                ref={(el) => {
                  valueRefs.current[f.key] = el;
                }}
                className={`mt-0.5 break-words text-[15px] font-semibold leading-snug text-ink ${f.copy ? "select-all tabular-nums tracking-wide" : ""}`}
              >
                {f.copy ? f.value : t(f.value)}
              </p>
            </div>
            {f.copy && (
              <button
                type="button"
                onClick={() => copy(f)}
                aria-label={`${t("Copy")} ${t(f.label)}`}
                className={`inline-flex !min-h-0 h-8 w-[5.5rem] shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${copied === f.key ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-brand/25 bg-white text-brand-dark hover:bg-brand-light"}`}
              >
                {copied === f.key ? (
                  <svg {...iconProps}>
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                ) : (
                  <svg {...iconProps}>
                    <rect x="9" y="9" width="11" height="11" rx="2" />
                    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                  </svg>
                )}
                {copied === f.key ? t("Copied") : t("Copy")}
              </button>
            )}
          </li>
        ))}
      </ul>
      {/* read out by screen readers when something is copied */}
      <span role="status" aria-live="polite" className="sr-only">
        {done ? `${t(done.label)}: ${t("Copied")}` : ""}
      </span>

      {action && (
        <div className="mt-auto pt-6">
          <a
            href={action.href}
            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="block rounded-full bg-gradient-to-r from-brand-dark to-brand px-6 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition hover:brightness-110"
          >
            {t(action.label)}
          </a>
          <p className="mt-2 text-center text-xs text-ink/55">{t("For donors who do not need an 80G receipt.")}</p>
        </div>
      )}
    </article>
  );
}

/** Bank-transfer details for every account (src/config/site.ts), in the style of the rest of the Donate page. */
export default function BankDetails() {
  const { t } = useLang();
  const last = bankAccounts.length - 1;
  return (
    <section className="bg-brand-light/50 py-12 md:py-16" aria-labelledby="bank-title">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="bank-title" className="text-3xl font-extrabold uppercase tracking-tight text-ink md:text-4xl">
            {t("Support Our Cause")} <span className="text-brand">– {t("Donate Now")}</span>
          </h2>
          <p className="mt-3 text-ink/70 md:text-lg">
            {t(
              "Your contribution helps Sahara Jan Kalyan Samiti provide education, nutrition, healthcare and community support to children, women and underserved families."
            )}
          </p>
        </div>
        <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-2xl bg-white px-4 py-3.5 text-left text-sm leading-relaxed text-ink/75 ring-1 ring-brand/15 sm:px-5">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
          >
            i
          </span>
          <p>
            <strong className="font-semibold text-ink">{t("Want an 80G receipt?")}</strong>{" "}
            {t(
              "Please donate through the donation form above and enter your PAN. Payments through the Razorpay link or by bank transfer do not get an automatic receipt."
            )}{" "}
            <a href="#donate-form" className="whitespace-nowrap font-semibold text-brand-dark hover:text-brand">
              {t("Go to the donation form")} →
            </a>
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bankAccounts.map((a, i) => (
            // with two cards across (tablets) an odd last card sits centred under them
            <Card
              key={a.id}
              account={a}
              className={
                i === last && bankAccounts.length % 2 === 1
                  ? "md:col-span-2 md:mx-auto md:w-full md:max-w-[calc(50%-0.75rem)] lg:col-span-1 lg:max-w-none"
                  : ""
              }
            />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-ink/60">
          {t("After a bank transfer, please email your name, amount and transaction reference to")}{" "}
          <a href={`mailto:${site.email}`} className="font-semibold text-brand-dark hover:text-brand">
            {site.email}
          </a>{" "}
          {t("so that we can send you a receipt.")}
        </p>
      </div>
    </section>
  );
}
