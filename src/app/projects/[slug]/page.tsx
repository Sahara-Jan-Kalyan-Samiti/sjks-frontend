import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { projects } from "@/data/content/content";
import { pageTextDefaults } from "@/data/content/pageContent";
import { buildMetadata } from "@/lib/seo";
import ProjectDetail from "@/features/projects/ProjectDetail";

type Props = { params: { slug: string } };
const find = (slug: string) => projects.find((p) => p.slug === slug);

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export function generateMetadata({ params }: Props): Metadata {
  const project = find(params.slug);
  if (!project) return { title: "Page not found", robots: { index: false } };
  // the original wording; text an admin edits shows in the page itself
  const title = pageTextDefaults[`project.${project.slug}.title`] ?? project.title;
  const description = pageTextDefaults[`project.${project.slug}.text`] ?? project.text;
  return buildMetadata({ title, description, path: `/projects/${project.slug}`, image: `/assets/images/${project.image}` });
}

export default function ProjectPage({ params }: Props) {
  // the programme was earlier at this address
  if (params.slug === "health-nutrition") permanentRedirect("/projects/medical-facilities");
  if (!find(params.slug)) notFound();
  return <ProjectDetail slug={params.slug} />;
}
