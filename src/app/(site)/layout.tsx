import { auth } from "@/lib/auth";
import { getSettings, siteContent } from "@/lib/schoolSettings";
import { isHexColor } from "@/lib/branding";
import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/subjects", label: "Subjects" },
  { href: "/online-classes", label: "Online classes" },
  { href: "/contact", label: "Contact" },
];

// The public website: header, footer and the school's accent colour
const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  const [settings, { role }] = await Promise.all([getSettings(), auth()]);
  const { logoUrl } = siteContent(settings);
  const brand = isHexColor(settings.brandColor) ? settings.brandColor : "#4f46e5";

  const accountLinks = role ? (
    <Link href={`/${role}`} className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:brightness-110">
      My dashboard
    </Link>
  ) : (
    <>
      <Link href="/sign-in" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[var(--brand)]">
        Sign in
      </Link>
      <Link href="/register" className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white hover:brightness-110">
        Register
      </Link>
    </>
  );

  return (
    <div style={{ "--brand": brand } as React.CSSProperties} className="min-h-screen flex flex-col bg-white text-gray-800">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image src={logoUrl} alt="" width={36} height={36} unoptimized className="h-9 w-9 object-contain" />
            <span className="truncate font-semibold">{settings.schoolName}</span>
          </Link>
          <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                {n.label}
              </Link>
            ))}
            <Link href="/for-schools" className="rounded-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              For schools
            </Link>
          </nav>
          <div className="hidden lg:flex items-center gap-1">{accountLinks}</div>
          {/* Small screens: a menu that works without JavaScript */}
          <details className="lg:hidden relative">
            <summary className="list-none cursor-pointer rounded-full border border-gray-200 px-3 py-1.5 text-sm">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-gray-100 bg-white p-2 shadow-lg flex flex-col">
              {[...NAV, { href: "/for-schools", label: "For schools" }].map((n) => (
                <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                  {n.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-wrap gap-2 border-t border-gray-100 pt-2">{accountLinks}</div>
            </div>
          </details>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-gray-900">{settings.schoolName}</span>
            <p className="text-gray-500">{siteContent(settings).tagline}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-gray-900">Visit</span>
            {NAV.slice(1).map((n) => (
              <Link key={n.href} href={n.href} className="text-gray-600 hover:text-[var(--brand)]">{n.label}</Link>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-gray-900">Get started</span>
            <Link href="/register/student" className="text-gray-600 hover:text-[var(--brand)]">Register as a learner</Link>
            <Link href="/register/parent" className="text-gray-600 hover:text-[var(--brand)]">Register as a parent</Link>
            <Link href="/sign-in" className="text-gray-600 hover:text-[var(--brand)]">Sign in</Link>
          </div>
          <div className="flex flex-col gap-1.5 text-gray-600">
            <span className="font-semibold text-gray-900">Contact</span>
            {settings.contactPhone && <a href={`tel:${settings.contactPhone.replace(/\s/g, "")}`}>{settings.contactPhone}</a>}
            {settings.contactEmail && <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}
            {settings.address && <span className="whitespace-pre-line">{settings.address}</span>}
            {!settings.contactPhone && !settings.contactEmail && !settings.address && (
              <Link href="/contact" className="hover:text-[var(--brand)]">Send us a message</Link>
            )}
          </div>
        </div>
        <div className="border-t border-gray-100">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-gray-400">
            <span>© {new Date().getFullYear()} {settings.schoolName}</span>
            <Link href="/for-schools" className="hover:text-[var(--brand)]">
              Run your school on this system →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
