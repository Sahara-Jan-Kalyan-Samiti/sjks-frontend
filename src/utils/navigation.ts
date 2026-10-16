/** The path of a menu address without its query or hash: "/projects#upcoming" -> "/projects". */
export const pathOf = (href: string): string => href.split(/[?#]/)[0] || "/";

/** Is `href` the current page, or a parent of it? "/" only matches the home page. */
export function isActivePath(pathname: string, href: string): boolean {
  const base = pathOf(href);
  return base === "/" ? pathname === "/" : pathname === base || pathname.startsWith(base + "/");
}
