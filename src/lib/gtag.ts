import { donationConversion } from "@/config/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Tells Google Ads a donation went through. The Razorpay payment id is the transaction id, so a donation counted once is never counted
 * twice. Does nothing where the Google tag is not loaded (local, stage and preview copies of the site).
 */
export function trackDonationConversion({ paymentId, amount }: { paymentId: string; amount: number }): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: donationConversion, value: amount, currency: "INR", transaction_id: paymentId });
}
