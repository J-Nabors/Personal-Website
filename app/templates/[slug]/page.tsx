import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { TemplateShell } from "@/components/template/TemplateShell";
import { templateConfigs } from "@/lib/templates";

export function generateStaticParams() {
  return templateConfigs.map((config) => ({ slug: config.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = templateConfigs.find((entry) => entry.slug === slug);

  if (!config) {
    return {
      title: "Template Not Found",
    };
  }

  return {
    title: `${config.title} | Urban Science Portfolio`,
    description: config.summary,
  };
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = templateConfigs.find((entry) => entry.slug === slug);

  if (!config) notFound();

  return (
    <main className="shell page">
      <Header />
      <TemplateShell key={config.slug} config={config} />
    </main>
  );
}
