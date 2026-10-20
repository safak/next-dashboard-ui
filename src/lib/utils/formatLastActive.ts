export function formatLastActive(date?: Date | string | null) {
  if (!date) return "Inactive";

  const last = new Date(date);
  const now = new Date();

  const diffMs = now.getTime() - last.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Active now";
  if (diffMin < 60) return `Last active ${diffMin} min ago`;

  const isToday = last.toDateString() === now.toDateString();

  if (isToday) {
    return `Last active Today at ${last.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return `Last active ${last.toLocaleDateString()} at ${last.toLocaleTimeString(
    [],
    { hour: "2-digit", minute: "2-digit" }
  )}`;
}
