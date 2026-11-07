export const siteHost: string;
export const bareHost: string;export const legacyPages: Record<string, string>;

export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
  has?: { type: "host"; value: string }[];
}

export function buildRedirects(): Redirect[];
