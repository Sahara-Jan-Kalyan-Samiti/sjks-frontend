import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/home/Home";

// Every page except Home is loaded on demand, so the first visit downloads only what it needs.
const About = lazy(() => import("@/pages/about/About"));
const Journey = lazy(() => import("@/pages/about/Journey"));
const Awards = lazy(() => import("@/pages/about/Awards"));
const Projects = lazy(() => import("@/pages/projects/Projects"));
const ProjectDetail = lazy(() => import("@/pages/projects/ProjectDetail"));
const Crowdfunding = lazy(() => import("@/pages/projects/Crowdfunding"));
const Media = lazy(() => import("@/pages/media/Media"));
const News = lazy(() => import("@/pages/news/News"));
const NewsDetail = lazy(() => import("@/pages/news/NewsDetail"));
const Events = lazy(() => import("@/pages/events/Events"));
const Blog = lazy(() => import("@/pages/blog/Blog"));
const BlogDetail = lazy(() => import("@/pages/blog/BlogDetail"));
const Transparency = lazy(() => import("@/pages/transparency/Transparency"));
const AnnualReports = lazy(() => import("@/pages/transparency/AnnualReports"));
const ImpactReport = lazy(() => import("@/pages/transparency/ImpactReport"));
const DonorTransparency = lazy(() => import("@/pages/transparency/DonorTransparency"));
const MemberID = lazy(() => import("@/pages/membership/MemberID"));
const Memberships = lazy(() => import("@/pages/membership/Memberships"));
const Donate = lazy(() => import("@/pages/support/Donate"));
const GetInvolved = lazy(() => import("@/pages/support/GetInvolved"));
const Contact = lazy(() => import("@/pages/support/Contact"));
const Legal = lazy(() => import("@/pages/legal/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/journey" element={<Journey />} />
          <Route path="/about/awards" element={<Awards />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/crowdfunding" element={<Crowdfunding />} />
          <Route path="/media" element={<Media />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/transparency/annual-reports" element={<AnnualReports />} />
          <Route path="/transparency/impact-report" element={<ImpactReport />} />
          <Route path="/transparency/donor-transparency" element={<DonorTransparency />} />
          <Route path="/member-id" element={<MemberID />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/privacy" element={<Legal kind="privacy" />} />
          <Route path="/terms" element={<Legal kind="terms" />} />
          <Route path="/dpdp" element={<Legal kind="dpdp" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
