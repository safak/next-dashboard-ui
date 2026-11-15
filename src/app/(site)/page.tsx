import {
  CtaBand,
  FeatureCard,
  LESSON_TYPES,
  PrimaryLink,
  SecondaryLink,
  Section,
  tint,
} from "@/components/site/SiteBlocks";
import prisma from "@/lib/prisma";
import { getSettings, siteContent } from "@/lib/schoolSettings";
import { deliveryLabels } from "@/lib/subjectDelivery";
import type { Metadata } from "next";
import Link from "next/link";

export const generateMetadata = async (): Promise<Metadata> => {
  const s = await getSettings();
  return { title: s.schoolName, description: siteContent(s).tagline };
};

const STEPS = [
  { title: "Register online", body: "Fill in your details, choose your subjects and how you want each one taught, and sign the enrolment agreement." },
  { title: "Get your student number", body: "You receive it straight away. Give it to your parent or guardian so they can create their own account." },
  { title: "We place you in a class", body: "The school reviews your registration and places you in a class for your grade, then your account is activated." },
  { title: "Start learning", body: "See your timetable, join online lessons, download study material and question papers, and track your results." },
];

const PARENT_FEATURES = [
  { icon: "📅", title: "Timetable and online classes", body: "See every lesson, and join Zoom or Teams classes from the dashboard." },
  { icon: "📈", title: "Results and attendance", body: "Follow marks, assignments and attendance for each child as the term goes on." },
  { icon: "📚", title: "Study material", body: "Notes, past question papers and memorandums for the subjects you're registered for." },
  { icon: "🧾", title: "Fees and statements", body: "See what's due, and download invoices and statements as PDF whenever you need them." },
];

const FAQ = [
  { q: "Which grades do you teach?", a: "Learners choose the grade they're enrolling into when they register. Contact us if you're not sure which class fits." },
  { q: "Can I mix online and in-person lessons?", a: "Yes. You choose a lesson type per subject, so Mathematics could be one-on-one while Physical Sciences is online." },
  { q: "How do parents get access?", a: "After a learner registers they receive a student number. The parent registers with that number and the learner's date of birth." },
  { q: "What do I need for online lessons?", a: "A phone, tablet or computer with a reliable internet connection. Lessons run on Zoom or Microsoft Teams and are joined from the dashboard." },
];

const HomePage = async () => {
  const [settings, subjects] = await Promise.all([
    getSettings(),
    prisma.subject.findMany({ select: { name: true, delivery: true }, orderBy: { name: "asc" } }),
  ]);
  const content = siteContent(settings);

  return (
    <>
      {/* HERO */}
      <section className={`${tint} border-b border-gray-100`}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
              Mathematics &amp; science tutoring
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
              {settings.schoolName}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-600">{content.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryLink href="/register">Register now</PrimaryLink>
              <SecondaryLink href="/subjects">See our subjects</SecondaryLink>
            </div>
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-medium text-gray-600 hover:text-[var(--brand)]"
              >
                Questions? Chat to us on WhatsApp →
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {LESSON_TYPES.map((t) => (
              <div key={t.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <span aria-hidden className="text-2xl">{t.icon}</span>
                <p className="mt-2 font-semibold text-gray-900">{t.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section title="Learn the way that works for you" intro="Choose how each subject is taught. You can change it later with the school.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LESSON_TYPES.map((t) => (
            <FeatureCard key={t.title} {...t} />
          ))}
        </div>
      </Section>

      {subjects.length > 0 && (
        <Section muted title="Subjects we offer" intro="Mathematics in all its forms, plus the sciences and commercial subjects that build on it.">
          <ul className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <li key={s.name} className="rounded-full bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-gray-100">
                <span className="font-medium">{s.name}</span>
                <span className="ml-2 text-xs text-gray-500">{deliveryLabels[s.delivery]}</span>
              </li>
            ))}
          </ul>
          <Link href="/subjects" className="mt-6 inline-block text-sm font-semibold text-[var(--brand)] hover:underline">
            Subject details →
          </Link>
        </Section>
      )}

      <Section title="How it works">
        <ol className="grid gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-gray-100 p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-gray-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section muted title="Everything in one place for learners and parents" intro="Every learner and parent gets their own secure account.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PARENT_FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <Section title="Questions parents ask">
        <div className="grid gap-3 md:grid-cols-2">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-gray-100 p-5 open:shadow-sm">
              <summary className="cursor-pointer list-none font-semibold text-gray-900 flex justify-between gap-4">
                {f.q}
                <span aria-hidden className="text-[var(--brand)] group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <CtaBand title="Ready to start?" body="Registration takes about ten minutes. Have your subjects and your parent's details ready." />
    </>
  );
};

export default HomePage;
