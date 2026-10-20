"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
};

export default function CollapsibleSection({
  title,
  description,
  icon,
  children,
  open,
  onToggle,
}: Props) {
  return (
    <div className="rounded-xl border bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-3 flex justify-between items-start text-left"
      >
        <div>
          <h2 className="text-xs font-semibold text-gray-800 flex items-center gap-2">
            {icon}
            {title}
          </h2>

          {description && (
            <p className="text-[11px] text-gray-500 mt-0.5">
              {description}
            </p>
          )}
        </div>

        <span
          className={`text-gray-500 text-2xl font-extrabold transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden px-4 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}