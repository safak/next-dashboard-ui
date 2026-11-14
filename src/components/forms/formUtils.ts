// <input type="datetime-local"> / type="date" need local-time strings,
// not Date objects or ISO strings in UTC
const pad = (n: number) => String(n).padStart(2, "0");

export const toDateTimeInput = (value?: Date | string | null) => {
  if (!value) return undefined;
  const d = new Date(value);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export const toDateInput = (value?: Date | string | null) =>
  toDateTimeInput(value)?.slice(0, 10);
