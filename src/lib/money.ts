// Amounts are stored as whole cents. Kept free of server-only imports so
// forms can use it too.

const rand = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" });

export const formatRand = (cents: number) => rand.format(cents / 100);

// "450", "450.5", "R 1 234,50", "1,234.50" -> cents; null when it isn't
// an amount. Spaces group thousands; a comma is the decimal mark unless a
// dot is also present (then commas group thousands).
export const parseRandToCents = (input: string): number | null => {
  let s = input.trim().replace(/^R/i, "").replace(/[\s  ]/g, "");
  s = s.includes(".") ? s.replace(/,(?=\d{3}(\D|$))/g, "") : s.replace(",", ".");
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(s)) return null;
  return Math.round(parseFloat(s) * 100);
};

export const centsToInput = (cents: number) =>
  (cents / 100).toFixed(2).replace(/\.00$/, "");
