export function getWeekRangeUTC() {
  const now = new Date();

  const day = now.getUTCDay(); // 0=Sun
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diffToMonday);
  monday.setUTCHours(0, 0, 0, 0);

  const todayEnd = new Date(now);
  todayEnd.setUTCHours(23, 59, 59, 999);

  return { start: monday, end: todayEnd };
}