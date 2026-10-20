"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;

  title: string;
  description?: string;

  children: ReactNode;

  width?: "sm" | "md" | "lg" | "xl";

  icon?: ReactNode;

  footer?: ReactNode;

  closeOnOverlayClick?: boolean;

  closeOnEscape?: boolean;

  /**
   * Removes the default body padding.
   *
   * Useful for forms/layouts that need to occupy
   * the complete drawer content area.
   */
  flush?: boolean;
}

const drawerWidth = {
  sm: "md:w-[340px]",
  md: "md:w-[520px]",
  lg: "md:w-[620px]",
  xl: "md:w-[960px]",
};

export default function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  width = "lg",
  icon,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  flush = false,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* ===========================
     Escape Key
  =========================== */

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, closeOnEscape, onClose]);

  /* ===========================
     Prevent Body Scroll
  =========================== */

  useEffect(() => {
    if (!open) return;

    const previous = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* ==================================================
          Overlay
      ================================================== */}

      <div
        aria-hidden="true"
        onClick={() => {
          if (closeOnOverlayClick) {
            onClose();
          }
        }}
        className={cn(
          "fixed inset-0 z-[998]",
          "bg-black/40 backdrop-blur-[2px]",
          "transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* ==================================================
          Drawer
      ================================================== */}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "fixed inset-y-0 right-0 z-[999]",

          "flex w-full flex-col",

          "border-l border-slate-200",
          "bg-white shadow-2xl",

          "transition-transform duration-300 ease-in-out",

          drawerWidth[width],

          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* ==================================================
            Header
        ================================================== */}

        <div className="shrink-0 border-b border-slate-200 bg-white">
          <div className="flex items-start justify-between p-4">
            {/* Left */}

            <div className="flex min-w-0 items-start gap-4">
              {icon && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  {icon}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  {title}
                </h2>

                {description && (
                  <p className="mt-1 text-xs text-slate-500">{description}</p>
                )}
              </div>
            </div>

            {/* Close */}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="
                shrink-0
                rounded-lg
                p-2
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-700
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ==================================================
            Body
        ================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50">
          {flush ? children : <div className="p-4">{children}</div>}
        </div>

        {/* ==================================================
            Footer
        ================================================== */}

        {footer && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-4">
            <div className="flex justify-end gap-3">{footer}</div>
          </div>
        )}
      </aside>
    </>,
    document.body,
  );
}
