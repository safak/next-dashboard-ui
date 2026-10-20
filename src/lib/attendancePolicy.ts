export function getISTTime() {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );
}

export function getTodayUTC() {
  const now = new Date();
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,0,0,0
  ));
}

export function isSameDayUTC(d1: Date, d2: Date) {
  return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10);
}