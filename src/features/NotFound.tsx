import Link from "next/link";

const suggestions = [
  { label: "Donate", href: "/donate" },
  { label: "Our Projects", href: "/projects" },
  { label: "Latest News", href: "/news" },
  { label: "Contact Us", href: "/contact" }
];

/** Shown for any address that does not exist. Offers the pages visitors most often want. */
export default function NotFound() {
  return (
    <section className="container-site px-4 py-16 text-center sm:py-24">
      <p className="eyebrow">404</p>
      <h1 className="h2 mt-2">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-ink/70">The page you are looking for does not exist or may have moved.</p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn btn-brand w-full sm:w-auto">
          Back to Home
        </Link>
        <Link href="/contact" className="btn w-full sm:w-auto">
          Contact us
        </Link>
      </div>
      <nav aria-label="Popular pages" className="mt-10">
        <p className="text-sm font-semibold text-ink/65">Or try one of these</p>
        <ul className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {suggestions.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="font-semibold text-brand underline-offset-4 hover:underline">
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
