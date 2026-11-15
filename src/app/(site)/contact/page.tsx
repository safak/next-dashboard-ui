import EnquiryForm from "@/components/site/EnquiryForm";
import { PageHero, Section } from "@/components/site/SiteBlocks";
import { getSettings } from "@/lib/schoolSettings";
import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  const s = await getSettings();
  return { title: `Contact · ${s.schoolName}` };
};

const ContactPage = async () => {
  const s = await getSettings();
  const details = [
    s.contactPhone && { label: "Phone", value: s.contactPhone, href: `tel:${s.contactPhone.replace(/\s/g, "")}` },
    s.whatsapp && { label: "WhatsApp", value: `+${s.whatsapp}`, href: `https://wa.me/${s.whatsapp}` },
    s.contactEmail && { label: "Email", value: s.contactEmail, href: `mailto:${s.contactEmail}` },
    s.address && { label: "Address", value: s.address },
    s.officeHours && { label: "Office hours", value: s.officeHours },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" intro="Questions about subjects, classes, fees or registration? Send us a message and we'll get back to you." />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="flex flex-col gap-4">
            {details.length === 0 && (
              <p className="text-gray-500">Use the form and we&apos;ll reply by email.</p>
            )}
            {details.map((d) => (
              <div key={d.label} className="rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">{d.label}</p>
                {d.href ? (
                  <a
                    href={d.href}
                    {...(d.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                    className="mt-1 block font-medium text-gray-900 hover:text-[var(--brand)] break-words"
                  >
                    {d.value}
                  </a>
                ) : (
                  <p className="mt-1 font-medium text-gray-900 whitespace-pre-line">{d.value}</p>
                )}
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h2>
            <EnquiryForm kind="GENERAL" />
          </div>
        </div>
      </Section>
    </>
  );
};

export default ContactPage;
