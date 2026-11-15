// Shared by the meeting dialog and the dashboards' Join buttons

export const providerLabels = {
  ZOOM: "Zoom",
  TEAMS: "Microsoft Teams",
  OTHER: "Online",
} as const;

export const VideoIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className={className}
    aria-hidden
  >
    <rect x="2" y="6" width="14" height="12" rx="2" />
    <path d="M16 10l6-3v10l-6-3z" strokeLinejoin="round" />
  </svg>
);
