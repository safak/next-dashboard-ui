import Link from "next/link";

// Building blocks shared by the public website pages

export const tint = "bg-[color-mix(in_srgb,var(--brand)_8%,white)]";

export const PageHero = ({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) => (
  <section className={`${tint} border-b border-gray-100`}>
    <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">{eyebrow}</p>
      )}
      <h1 className="mt-2 max-w-3xl text-3xl md:text-5xl font-bold tracking-tight text-gray-900">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-lg text-gray-600">{intro}</p>}
      {children}
    </div>
  </section>
);

export const Section = ({
  title,
  intro,
  children,
  muted,
}: {
  title?: string;
  intro?: string;
  children: React.ReactNode;
  muted?: boolean;
}) => (
  <section className={muted ? "bg-gray-50" : ""}>
    <div className="mx-auto max-w-6xl px-4 py-14">
      {title && <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">{title}</h2>}
      {intro && <p className="mt-2 max-w-2xl text-gray-600">{intro}</p>}
      <div className={title || intro ? "mt-8" : ""}>{children}</div>
    </div>
  </section>
);

export const FeatureCard = ({ title, body, icon }: { title: string; body: string; icon?: string }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    {icon && (
      <span aria-hidden className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${tint} text-lg`}>
        {icon}
      </span>
    )}
    <h3 className="font-semibold text-gray-900">{title}</h3>
    <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{body}</p>
  </div>
);

export const PrimaryLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="inline-flex items-center rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110">
    {children}
  </Link>
);

export const SecondaryLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:border-[var(--brand)] hover:text-[var(--brand)]">
    {children}
  </Link>
);

export const CtaBand = ({ title, body }: { title: string; body: string }) => (
  <section className="bg-[var(--brand)]">
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between">
      <div className="text-white">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-white/85">{body}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/register" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100">
          Register now
        </Link>
        <Link href="/contact" className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
          Ask a question
        </Link>
      </div>
    </div>
  </section>
);

export const LESSON_TYPES = [
  {
    icon: "👤",
    title: "One-on-one",
    body: "A teacher's full attention, at your pace, focused on exactly what you find hard.",
  },
  {
    icon: "👥",
    title: "Group classes",
    body: "Small groups that learn together, ask questions and practise exam work side by side.",
  },
  {
    icon: "🏠",
    title: "House calls",
    body: "A teacher comes to your home, so lessons fit around family and travel time.",
  },
  {
    icon: "💻",
    title: "Online",
    body: "Live lessons on Zoom or Microsoft Teams, joined with one click from your dashboard.",
  },
];
