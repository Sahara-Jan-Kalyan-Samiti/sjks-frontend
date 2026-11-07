/**
 * Justified text only looks right when a line is long enough: in a narrow box the browser has to stretch the spaces
 * between a few words to fill the line. This watches every justifiable paragraph and gives the ones that are too narrow
 * the class "no-justify" (see src/styles/index.css), which takes the justification away; wide paragraphs stay justified.
 *
 * A ResizeObserver does the measuring: it reports each box's width after the browser has laid the page out anyway, so the
 * check never forces an extra layout. Changing the class does not change the box width, so it never triggers itself.
 * A MutationObserver only looks at newly added nodes, to start observing paragraphs that appear later.
 */
/** Narrowest line, in letter-heights (em), that is still justified: about 80 characters, i.e. text running most of the page width. */
const MIN_EM = 42;
const SELECTOR = "main p, main .justified";

/** React tags a node with a "__reactFiber$..." key once it has taken it over; changing the class earlier would break hydration. */
const isHydrated = (el: HTMLElement) => Object.keys(el).some((k) => k.startsWith("__reactFiber$"));

let started = false;
export function watchJustify() {
  if (started || typeof window === "undefined" || typeof ResizeObserver === "undefined") return;
  started = true;

  const observed = new WeakSet<Element>();
  /** paragraphs React has not taken over yet; tried again on the next change or shortly after */
  let waiting = new Set<HTMLElement>();
  let retry = 0,
    tries = 0;

  const ro = new ResizeObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement;
      const width = e.contentBoxSize?.[0]?.inlineSize ?? e.contentRect.width;
      if (width <= 0) continue;
      // style and layout are already up to date inside a ResizeObserver callback, so this read is cheap
      const size = parseFloat(getComputedStyle(el).fontSize) || 16;
      el.classList.toggle("no-justify", width / size < MIN_EM);
    }
  });

  const watch = (el: HTMLElement, force = false) => {
    if (observed.has(el)) return;
    if (!force && !isHydrated(el)) {
      waiting.add(el);
      return;
    }
    observed.add(el);
    ro.observe(el);
  };
  const scan = (root: Element) => {
    if (root.matches(SELECTOR)) watch(root as HTMLElement);
    root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => watch(el));
  };
  const flushWaiting = () => {
    retry = 0;
    const list = waiting;
    waiting = new Set();
    // after a few seconds, what still has no React fiber never will (e.g. HTML from the CMS put in with dangerouslySetInnerHTML)
    const force = ++tries > 10;
    list.forEach((el) => el.isConnected && watch(el, force));
    // parts of the page that React hydrates later (Suspense) are tried again shortly
    if (waiting.size) retry = window.setTimeout(flushWaiting, 300);
  };

  new MutationObserver((list) => {
    for (const m of list)
      m.addedNodes.forEach((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) scan(n as Element);
      });
    if (waiting.size && !retry) retry = window.setTimeout(flushWaiting, 60);
  }).observe(document.body, { childList: true, subtree: true });

  scan(document.body);
  if (waiting.size) retry = window.setTimeout(flushWaiting, 60);
}
