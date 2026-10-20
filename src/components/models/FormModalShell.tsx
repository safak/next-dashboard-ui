"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

export default function FormModalShell({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/40 backdrop-blur-sm
        flex items-end sm:items-center justify-center
      "
    >
      <div
        className="
          w-full sm:max-w-xl
          bg-white shadow-2xl border
          rounded-t-3xl sm:rounded-2xl
          p-4 sm:p-6
          max-h-[90vh] overflow-y-auto
        "
      >
        {/* CLOSE BUTTON */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
