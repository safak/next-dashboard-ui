"use client";

import { useState, useTransition } from "react";
import { testIntegrations } from "@/lib/meetingActions";

const services = [
  { key: "zoom" as const, name: "Zoom", keys: "ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET" },
  {
    key: "teams" as const,
    name: "Microsoft Teams",
    keys: "MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MS_ORGANIZER_EMAIL",
  },
];

const IntegrationStatus = ({ configured }: { configured: { zoom: boolean; teams: boolean } }) => {
  const [results, setResults] = useState<{ zoom: string; teams: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {services.map((s) => {
          const result = results?.[s.key];
          const ok = result === "Working";
          return (
            <li key={s.key} className="flex flex-col gap-1 rounded-lg ring-1 ring-gray-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{s.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    configured[s.key] ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {configured[s.key] ? "Keys added" : "Not connected"}
                </span>
              </div>
              {!configured[s.key] && (
                <p className="text-xs text-gray-500">
                  Add {s.keys} to the .env file and restart the app.
                </p>
              )}
              {result && configured[s.key] && (
                <p className={`text-xs ${ok ? "text-green-700" : "text-red-600"}`}>
                  {ok ? "Connection test passed." : result}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="btn-primary self-start"
        disabled={pending || (!configured.zoom && !configured.teams)}
        onClick={() =>
          startTransition(async () => {
            setResults(await testIntegrations());
          })
        }
      >
        {pending ? "Testing..." : "Test connection"}
      </button>
    </div>
  );
};

export default IntegrationStatus;
