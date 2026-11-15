import EnquiryForm from "@/components/site/EnquiryForm";
import { FeatureCard, PageHero, Section, tint } from "@/components/site/SiteBlocks";
import { getSettings } from "@/lib/schoolSettings";
import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const s = await getSettings();
  return {
    title: `School management system · ${s.schoolName}`,
    description: "The system that runs our school, ready to set up for yours.",
  };
};

const FEATURES = [
  { icon: "📝", title: "Online registration", body: "Learners register with their details, subjects, lesson types and a signed enrolment agreement. You approve and place them in a class." },
  { icon: "👪", title: "Parent accounts", body: "Parents link to their children with a student number and date of birth, and follow everything from their own login." },
  { icon: "🗓️", title: "Classes and timetables", body: "Classes, lessons, exams, assignments, results and attendance, with a timetable for every learner and teacher." },
  { icon: "🎥", title: "Zoom and Teams built in", body: "Create a Zoom or Microsoft Teams meeting for a lesson in one click; learners get a Join button on their dashboard." },
  { icon: "📚", title: "Study material", body: "Teachers upload notes, question papers and memos; learners only see their own subjects and grade." },
  { icon: "💳", title: "Fees and statements", body: "Monthly invoices from your fee table, sibling discounts, payment records, overdue reminders and PDF statements." },
  { icon: "🌐", title: "Your own website", body: "A public website like this one, with your name, logo, colours, contact details and an enquiry form." },
  { icon: "🔒", title: "Secure by design", body: "Role-based access, locked-out guessing, forced password changes and private file downloads." },
];

const STEPS = [
  { title: "Request a demo", body: "Tell us about your school using the form below." },
  { title: "See it working", body: "We walk you through the system with your team, as admin, teacher, parent and learner." },
  { title: "We set up your copy", body: "Your own private installation, branded with your name, logo and colours, with your subjects, classes and fees." },
  { title: "Go live", body: "Your staff sign in, learners register online, and parents link up with their student numbers." },
];

const ForSchoolsPage = async () => {
  const s = await getSettings();
  return (
    <>
      <PageHero
        eyebrow="For schools"
        title="Run your school on the system we use every day"
        intro={`${s.schoolName} runs on this system: registrations, classes, online lessons, study material and fees in one place. Each school gets its own private, branded copy.`}
      >
        <a href="#demo" className="mt-8 inline-flex rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white hover:brightness-110">
          Request a demo
        </a>
      </PageHero>

      <Section title="What's included">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <Section muted title="Getting started">
        <ol className="grid gap-4 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-1.5 text-sm text-gray-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <section id="demo" className={`${tint} scroll-mt-20`}>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Request a demo</h2>
            <p className="mt-3 text-gray-600">
              Tell us a little about your school and what you&apos;d like the system to do. We&apos;ll
              contact you to arrange a walkthrough and discuss setup.
            </p>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-gray-700">
              <li>✓ Works for tutoring centres and full schools</li>
              <li>✓ Runs in any modern browser, on phones too</li>
              <li>✓ Your data stays in your own installation</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <EnquiryForm kind="SCHOOL_DEMO" />
          </div>
        </div>
      </section>
    </>
  );
};

export default ForSchoolsPage;
