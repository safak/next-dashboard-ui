"use client";

interface FormFooterProps {
  type: "create" | "update";
  loading: boolean;
  onCancel: () => void;
}

export default function FormFooter({
  type,
  loading,
  onCancel,
}: FormFooterProps) {
  return (
    <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 min-w-[150px] items-center justify-center rounded-lg bg-sky-600 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : type === "create"
              ? "Create Student"
              : "Update Student"}
        </button>
      </div>
    </div>
  );
}