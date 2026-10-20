// components/ui/FeeBadges.tsx
import clsx from "clsx";

export function FeeTypeChip({ type }: { type: string }) {
  const styles: Record<string, string> = {
    ADMISSION: "bg-purple-100 text-purple-700",
    TERM: "bg-blue-100 text-blue-700",
    ANNUAL: "bg-green-100 text-green-700",
    MISC: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={clsx(
        "px-2 py-0.5 text-xs font-medium rounded-full",
        styles[type] ?? "bg-gray-100 text-gray-700"
      )}
    >
      {type}
    </span>
  );
}

export function FeeStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={clsx(
        "px-2 py-0.5 text-xs font-medium rounded-full",
        active
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      )}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function FeeTermBadge({ term }: { term?: string | null }) {
  if (!term) return null;

  return (
    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
      {term.replace("_", " ")}
    </span>
  );
}

// ✅ Add to FeeBadges.tsx

export function PaymentStatusBadge({
  status,
}: {
  status: "PAID" | "PARTIAL" | "PENDING";
}) {
  const styles = {
    PAID: "bg-green-100 text-green-700",
    PARTIAL: "bg-yellow-100 text-yellow-700",
    PENDING: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}
