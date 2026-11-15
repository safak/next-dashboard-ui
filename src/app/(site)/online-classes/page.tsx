import { CtaBand, FeatureCard, PageHero, Section } from "@/components/site/SiteBlocks";
import { getSettings } from "@/lib/schoolSettings";
import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const s = await getSettings();
  return { title: `Online classes · ${s.schoolName}` };
};

const HOW = [
  { icon: "🔗", title: "One click to join", body: "Your dashboard lists this week's online lessons with a Join button. No hunting for links in messages." },
  { icon: "🎥", title: "Zoom or Microsoft Teams", body: "Lessons run on Zoom or Teams, so you can join from a phone, tablet or computer." },
  { icon: "📄", title: "Material ready to download", body: "Notes, question papers and memorandums for your subjects are on the Materials page, before and after class." },
  { icon: "👨‍👩‍👧", title: "Parents can see it too", body: "Parents see the same online class list for each child, so they know when lessons are on." },
];

const NEED = [
  "A phone, tablet or computer with a camera and microphone (earphones help)",
  "A stable internet connection, about 1–2 Mbps for video",
  "The free Zoom or Microsoft Teams app, or a web browser",
  "A quiet place to work, with a calculator and exam pad nearby",
];

const OnlineClassesPage = () => (
  <>
    <PageHero
      eyebrow="Online classes"
      title="Live lessons, wherever you are"
      intro="Online lessons are taught live by our teachers, just like in the classroom: you can ask questions, work through problems and get feedback."
    />
    <Section title="How online lessons work">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW.map((h) => (
          <FeatureCard key={h.title} {...h} />
        ))}
      </div>
    </Section>
    <Section muted title="What you need">
      <ul className="grid gap-3 sm:grid-cols-2">
        {NEED.map((n) => (
          <li key={n} className="flex gap-3 rounded-2xl bg-white p-4 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100">
            <span aria-hidden className="text-[var(--brand)] font-bold">✓</span>
            {n}
          </li>
        ))}
      </ul>
    </Section>
    <CtaBand title="Prefer learning from home?" body="Choose “Online” for any subject offered online when you register." />
  </>
);

export default OnlineClassesPage;
