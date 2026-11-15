"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateWebsiteSettings } from "@/lib/websiteActions";

type Values = {
  tagline: string;
  aboutText: string;
  missionText: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  whatsapp: string;
  officeHours: string;
  showFeesPublicly: boolean;
  brandColor: string;
};

const label = "text-xs font-medium text-gray-600";

const TEXT_FIELDS: { name: keyof Values; label: string; rows?: number; placeholder?: string; wide?: boolean }[] = [
  { name: "tagline", label: "Tagline (under the school name)", wide: true },
  { name: "aboutText", label: "About the school", rows: 5, wide: true },
  { name: "missionText", label: "Mission", rows: 2, wide: true },
  { name: "contactPhone", label: "Phone", placeholder: "012 345 6789" },
  { name: "contactEmail", label: "Email", placeholder: "info@school.co.za" },
  { name: "whatsapp", label: "WhatsApp number (digits, with 27)", placeholder: "27821234567" },
  { name: "officeHours", label: "Office hours", placeholder: "Mon–Fri 08:00–17:00" },
  { name: "address", label: "Address", rows: 2, wide: true },
];

export const WebsiteSettingsForm = ({ values, defaults }: { values: Values; defaults: Record<string, string> }) => {
  const [state, action, pending] = useActionState(updateWebsiteSettings, { success: false, error: false });
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast("Website settings saved.");
      router.refresh();
    }
  }, [state, router]);

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const get = (k: string) => String(f.get(k) ?? "");
        startTransition(() =>
          action({
            ...(Object.fromEntries(TEXT_FIELDS.map((t) => [t.name, get(t.name)])) as Omit<Values, "showFeesPublicly" | "brandColor">),
            showFeesPublicly: f.get("showFeesPublicly") === "on",
            brandColor: get("brandColor"),
          })
        );
      }}
    >
      {TEXT_FIELDS.map((t) => (
        <div key={t.name} className={`flex flex-col gap-1.5 ${t.wide ? "sm:col-span-2" : ""}`}>
          <label htmlFor={`w-${t.name}`} className={label}>{t.label}</label>
          {t.rows ? (
            <textarea
              id={`w-${t.name}`}
              name={t.name}
              rows={t.rows}
              defaultValue={values[t.name] as string}
              placeholder={defaults[t.name] ?? t.placeholder}
              className="form-control"
            />
          ) : (
            <input
              id={`w-${t.name}`}
              name={t.name}
              defaultValue={values[t.name] as string}
              placeholder={defaults[t.name] ?? t.placeholder}
              className="form-control"
            />
          )}
        </div>
      ))}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="w-brandColor" className={label}>Website accent colour</label>
        <input id="w-brandColor" name="brandColor" type="color" defaultValue={values.brandColor} className="h-10 w-20 rounded-lg border border-gray-200" />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700 self-end">
        <input type="checkbox" name="showFeesPublicly" defaultChecked={values.showFeesPublicly} className="accent-indigo-500" />
        Show monthly fees on the website&apos;s Subjects page
      </label>
      <p className="sm:col-span-2 text-xs text-gray-500">
        Leave a text field empty to use the built-in wording shown in grey.
      </p>
      {state.error && <p className="sm:col-span-2 text-sm text-red-500">{state.message}</p>}
      <button className="btn-primary justify-self-start" disabled={pending}>
        {pending ? "Saving..." : "Save website settings"}
      </button>
    </form>
  );
};

export const LogoUpload = ({ logoUrl, custom }: { logoUrl: string; custom: boolean }) => {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const send = async (method: "POST" | "DELETE", file?: File) => {
    setBusy(true);
    setError(null);
    const body = file ? (() => { const f = new FormData(); f.append("logo", file); return f; })() : undefined;
    const res = await fetch("/api/branding/logo", { method, body }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setError((await res?.json().catch(() => null))?.error ?? "Couldn't update the logo.");
      return;
    }
    toast(method === "POST" ? "Logo updated." : "Logo reset.");
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoUrl} alt="Current logo" className="h-16 w-16 rounded-xl border border-gray-100 object-contain p-1" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" disabled={busy} onClick={() => input.current?.click()}>
            {busy ? "Uploading..." : "Upload logo"}
          </button>
          {custom && (
            <button type="button" className="text-sm text-gray-500 hover:text-red-600" disabled={busy} onClick={() => send("DELETE")}>
              Use default logo
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500">PNG, JPG or WebP, square works best, up to 2 MB.</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <input
        ref={input}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) send("POST", file);
          e.target.value = "";
        }}
      />
    </div>
  );
};
