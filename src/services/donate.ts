import { API_BASE } from "@/hooks/useLiveData";

/** What Razorpay Checkout hands back after a successful payment. */
export interface PaymentProof {
  order_id: string;
  payment_id: string;
  signature: string;
}
export interface DonationInput {
  amount: number;
  name: string;
  email: string;
  pan: string;
}
export interface PaidDonation extends PaymentProof {
  amount: number;
  name: string;
  email: string;
}

interface CheckoutResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface CheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill: { name: string; email: string };
  notes: Record<string, string>;
  theme: { color: string };
  handler: (r: CheckoutResponse) => void;
  modal: { ondismiss: () => void };
}
interface CheckoutInstance {
  open(): void;
  on(event: "payment.failed", cb: (r: { error: { description?: string } }) => void): void;
}
declare global {
  interface Window {
    Razorpay?: new (options: CheckoutOptions) => CheckoutInstance;
  }
}

/** Raised for things the donor should read (bad input, payment declined); anything else shows a generic message. */
export class DonateError extends Error {}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new DonateError("Could not load the payment window. Check your internet connection and try again."));
    document.head.appendChild(script);
  });
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_BASE + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw new DonateError("Could not reach the server. Please try again.");
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string } & T;
  if (!res.ok) throw new DonateError(data.error || "Something went wrong. Please try again.");
  return data;
}

/**
 * Creates the order on the server, opens Razorpay Checkout and resolves with the confirmed payment.
 * Resolves with null when the donor closes the window without paying. The receipt itself is created by the server
 * (webhook) and e-mailed; this only confirms the payment is genuine so the page can show it.
 */
export async function startDonation(input: DonationInput, orgName: string): Promise<PaidDonation | null> {
  const [order] = await Promise.all([
    post<{ keyId: string; orderId: string; amount: number; currency: string }>("/api/public/donations/order", {
      ...input,
      pan: input.pan || undefined
    }),
    loadCheckout()
  ]);

  return new Promise((resolve, reject) => {
    // Checkout stays open after a failed attempt so the donor can try another card or UPI. A failure is therefore only
    // reported if the donor gives up (closes the window); a later successful attempt still resolves normally.
    let lastFailure = "";
    const checkout = new window.Razorpay!({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: orgName,
      description: "Donation",
      prefill: { name: input.name, email: input.email },
      // Also on the payment itself: the webhook reads these to fill the donation and to know the payment came from the website.
      notes: { source: "website", name: input.name, email: input.email, pan: input.pan },
      theme: { color: "#0b4f9c" },
      modal: { ondismiss: () => (lastFailure ? reject(new DonateError(lastFailure)) : resolve(null)) },
      handler: (r) => {
        const proof = { order_id: r.razorpay_order_id, payment_id: r.razorpay_payment_id, signature: r.razorpay_signature };
        post("/api/public/donations/verify", proof)
          .then(() => resolve({ ...proof, amount: input.amount, name: input.name, email: input.email }))
          .catch(() =>
            reject(
              new DonateError(
                `We could not confirm your payment on this page. If the money was deducted it is safe: please contact us with payment ID ${proof.payment_id}.`
              )
            )
          );
      }
    });
    checkout.on("payment.failed", (r) => {
      lastFailure = r.error.description || "The payment failed. You have not been charged.";
    });
    checkout.open();
  });
}

/** Address of the printable receipt page for a confirmed payment. */
export const receiptUrl = (p: PaymentProof): string =>
  `${API_BASE}/api/public/donations/receipt?${new URLSearchParams({ order_id: p.order_id, payment_id: p.payment_id, signature: p.signature })}`;
