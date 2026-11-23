/** "Verified on Mitr" badge: links to the organisation's Mitr profile. A plain image, so it is in the page's HTML for Mitr's check. */
export default function MitrBadge({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://mitr.co.in/ngos/sahara-jan-kalyan-samiti-sagar"
      target="_blank"
      rel="noopener"
      className={`inline-block transition hover:-translate-y-0.5 ${className}`}
    >
      <img
        src="https://api.mitr.co.in/api/v1/ngos/sahara-jan-kalyan-samiti-sagar/badge.svg?theme=light&style=standard"
        alt="Sahara Jan Kalyan Samiti, Sagar — Verified on Mitr"
        width={244}
        height={60}
        loading="lazy"
        decoding="async"
        className="h-[60px] w-[244px]"
      />
    </a>
  );
}
