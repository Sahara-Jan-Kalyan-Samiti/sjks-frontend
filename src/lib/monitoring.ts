import { env } from "@/lib/env";

let ready: Promise<typeof import("@sentry/browser")> | null = null;

/**
 * Sends an error to Sentry when NEXT_PUBLIC_SENTRY_DSN is set; otherwise does nothing.
 * The Sentry code is downloaded only when the first error happens, so it costs nothing on normal page loads.
 */
export function reportError(error: unknown) {
  if (!env.sentryDsn || typeof window === "undefined") return;
  ready ??= import("@sentry/browser").then((Sentry) => {
    Sentry.init({ dsn: env.sentryDsn, environment: process.env.NODE_ENV, tracesSampleRate: 0 });
    return Sentry;
  });
  ready
    .then((Sentry) => Sentry.captureException(error))
    .catch(() => {
      /* reporting must never break the page */
    });
}
