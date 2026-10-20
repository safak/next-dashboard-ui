"use client";

type Announcement = {
  id: number;
  title: string;
  createdAt: Date | string;
};

export default function AnnouncementTicker({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const getIcon = (title: string) => {
    const text = title.toLowerCase();

    if (text.includes("holiday") || text.includes("holi")) return "🎉";
    if (text.includes("exam") || text.includes("test")) return "📘";
    if (text.includes("meeting")) return "⚠️";
    if (text.includes("event")) return "📅";

    return "📢";
  };

  if (!announcements.length) return null;

  return (
    <div className="flex w-full items-center gap-3 overflow-hidden">
      <span className="whitespace-nowrap text-sm font-semibold text-gray-700">
        📢 Announcements
      </span>

      <div className="flex-1 overflow-hidden">
        <div className="flex animate-marquee items-center gap-10 whitespace-nowrap text-sm text-gray-700">
          {[...announcements, ...announcements].map((a, i) => (
            <span
              key={`${a.id}-${i}`}
              className="flex items-center gap-2 font-medium"
            >
              <span>{getIcon(a.title)}</span>

              <span>{a.title}</span>

              <span className="text-xs text-gray-400">
                {new Date(a.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
