"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const dir = "/assets/images/gallery/csr-volunteering";
export const involvedImages = {
  volunteerHero: `${dir}/sap-volunteers-group.jpg`,
  csrHero: `${dir}/employee-volunteers-sahara-banner.jpg`,
  withStudents: `${dir}/sap-volunteer-with-students.jpg`,
  activity: `${dir}/sap-volunteering-activity.jpg`,
  workshop: `${dir}/sap-volunteers-workshop.jpg`,
  planting: "/assets/images/gallery/environment/plantation-volunteers-planting.jpg"
};

/** Row of figures under the banner: a quick, credible summary of the page. */
export function StatStrip({ items }: { items: [string, string][] }) {
  return (
    <section className="relative z-10 -mt-10 md:-mt-14">
      <div className="container-site">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10 shadow-[0_20px_50px_-28px_rgba(11,61,122,.45)] ring-1 ring-ink/10 lg:grid-cols-4">
          {items.map(([v, l]) => (
            <div key={l} className="bg-white px-5 py-6 text-center">
              <dt className="font-serif text-2xl font-bold text-brand-dark md:text-3xl">{v}</dt>
              <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-ink/60">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Photo with a short caption, used in the "see the work" strip. */
function Photo({ src, caption, className = "" }: { src: string; caption: string; className?: string }) {
  return (
    <figure className={`group relative overflow-hidden rounded-2xl bg-ink/5 shadow-sm ring-1 ring-ink/10 ${className}`}>
      <img
        src={src}
        alt={caption}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061a36]/85 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-white">
        {caption}
      </figcaption>
    </figure>
  );
}

/** "See the work" photo mosaic: one large photo and two smaller ones. */
export function PhotoStrip({ eyebrow, title, photos }: { eyebrow: string; title: string; photos: [string, string][] }) {
  const [a, b, c] = photos;
  return (
    <section className="container-site py-14 md:py-16">
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2 mt-2">{title}</h2>
        </div>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2 md:grid-rows-2">
        <Photo src={a[0]} caption={a[1]} className="aspect-[4/3] md:row-span-2 md:aspect-auto md:min-h-[26rem]" />
        <Photo src={b[0]} caption={b[1]} className="aspect-[16/10]" />
        <Photo src={c[0]} caption={c[1]} className="aspect-[16/10]" />
      </div>
    </section>
  );
}

/** Tick list shared by the two form sections. */
export function TickList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3 text-sm text-ink/80">
      {items.map((x) => (
        <li key={x} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white"
          >
            ✓
          </span>
          {x}
        </li>
      ))}
    </ul>
  );
}

/** Closing banner pointing to the sister page (volunteer or CSR) and to donating. */
export function CrossLink({ title, text, href, cta }: { title: string; text: string; href: string; cta: string }) {
  return (
    <section className="container-site py-14 md:py-16">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-br from-brand-dark to-brand p-8 text-white shadow-[0_24px_60px_-30px_rgba(11,61,122,.7)] md:flex-row md:items-center md:p-12">
        <div className="max-w-xl">
          <h2 className="font-serif text-2xl font-bold md:text-3xl">{title}</h2>
          <p className="mt-2 text-white/85">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={href} className="btn-light btn-light-lg">
            {cta} <span aria-hidden="true">→</span>
          </Link>
          <Link href="/donate" className="btn-light btn-light-lg">
            Donate now
          </Link>
        </div>
      </div>
    </section>
  );
}
