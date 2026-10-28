/**
 * Justified text only looks right when a line is long enough: in a narrow box the browser has to stretch the spaces
 * between a few words to fill the line. This watches the page and gives every justified paragraph that is too narrow
 * the class "no-justify" (see src/index.css), so it is left-aligned with normal word spacing; wide paragraphs stay justified.
 * It re-checks when the page content or the window size changes.
 */
/** Narrowest line, in letter-heights (em), that is still justified: about 80 characters, i.e. text running most of the page width. */
const MIN_EM = 42;
const SELECTOR = "main p, main .justified";

/** React tags a node with a "__reactFiber$..." key once it has taken it over; changing the class earlier would break hydration. */
const isHydrated = (el: HTMLElement) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));

function check(retries = 10) {
  let pending = false;
  const els: HTMLElement[] = [];
  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
    if (!isHydrated(el)) pending = true;
    else els.push(el);
  });
  // Three passes (change, measure, change) instead of changing and measuring one paragraph after another: a measurement right after a
  // change makes the browser lay the whole page out again, which on a long page happened hundreds of times per check.
  // 1. every box is measured without the class, so a box that has become wide enough is justified again
  const wasNarrow = els.map((el) => el.classList.contains("no-justify"));
  els.forEach((el, i) => {
    if (wasNarrow[i]) el.classList.remove("no-justify");
  });
  // 2. all the measuring together
  const narrow = els.map((el) => {
    const cs = getComputedStyle(el);
    if (cs.textAlign !== "justify") return false;
    const width = el.clientWidth,
      size = parseFloat(cs.fontSize) || 16;
    return width > 0 && width / size < MIN_EM;
  });
  // 3. the narrow ones lose the justification
  els.forEach((el, i) => {
    if (narrow[i]) el.classList.add("no-justify");
  });
  // parts of the page that React hydrates later (Suspense) are checked again shortly
  if (pending && retries > 0) window.setTimeout(() => check(retries - 1), 300);
}

let started = false;
export function watchJustify() {
  if (started || typeof window === "undefined") return;
  started = true;
  let queued = false;
  // a short timer rather than "next frame": frames stop while the tab is in the background, a timer does not
  const later = () => {
    if (queued) return;
    queued = true;
    window.setTimeout(() => {
      queued = false;
      check();
    }, 60);
  };
  // class changes made here are not watched, so the check never triggers itself
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  window.addEventListener("resize", later);
  document.fonts?.ready.then(later).catch(() => {});
  later();
}
