import { CtaBand, FeatureCard, PageHero, Section } from "@/components/site/SiteBlocks";
import { getSettings, siteContent } from "@/lib/schoolSettings";
import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const s = await getSettings();
  return { title: `About · ${s.schoolName}` };
};

const VALUES = [
  { icon: "🎯", title: "Understanding first", body: "We teach why methods work, not only how, so learners can handle questions they haven't seen before." },
  { icon: "🧩", title: "Personal", body: "Each learner chooses their subjects and how they're taught, and teachers adapt to where each learner is." },
  { icon: "📝", title: "Exam ready", body: "Regular practice with past question papers and memorandums, with feedback learners can act on." },
  { icon: "🤝", title: "Parents included", body: "Parents see lessons, results, attendance and fees in their own account, without having to ask." },
];

const AboutPage = async () => {
  const settings = await getSettings();
  const content = siteContent(settings);

  return (
    <>
      <PageHero eyebrow="About us" title={`About ${settings.schoolName}`} intro={content.tagline} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">{content.about}</div>
          <aside className="rounded-2xl bg-gray-50 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">Our mission</h2>
            <p className="mt-2 text-gray-800 whitespace-pre-line">{content.mission}</p>
          </aside>
        </div>
      </Section>
      <Section muted title="How we teach">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <FeatureCard key={v.title} {...v} />
          ))}
        </div>
      </Section>
      <CtaBand title="Come and learn with us" body="Register online, or contact us if you'd like to talk it through first." />
    </>
  );
};

export default AboutPage;
