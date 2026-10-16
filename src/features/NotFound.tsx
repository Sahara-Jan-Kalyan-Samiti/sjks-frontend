import Link from "next/link";
export default function NotFound() {
  return (<section className="container-site py-24 text-center"><p className="eyebrow">404</p><h1 className="h2 mt-2">Page not found</h1>
    <p className="mt-3 text-ink/70">The page you are looking for does not exist.</p><Link href="/" className="btn btn-brand mt-6">Back to Home</Link></section>);
}
