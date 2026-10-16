import type { ReactNode } from "react";
import FloatingActions from "./FloatingActions";
import Footer from "./Footer";
import Header from "./Header";
import PageTransition from "./PageTransition";
import ScrollToTop from "./ScrollToTop";
import TopBar from "./TopBar";

/** The frame around every page: skip link, live strip, menu, the page itself, footer and the floating buttons. */
export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
        Skip to content
      </a>
      <ScrollToTop />
      <TopBar />
      <Header />
      <main id="main">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
