"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type Props = {
  role: "admin" | "teacher" | "student" | "parent";
};

export default function UserCardActions({ role }: Props) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );

  /* ================= SCREEN SIZE ================= */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ================= OPEN MENU ================= */
  const openMenu = () => {
    if (!buttonRef.current) return;

    if (!isMobile) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: rect.right - 192,
      });
    }

    setOpen(true);
  };

  /* ================= AUTO CLOSE ================= */
  useEffect(() => {
    if (!open) return;

    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);

    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  return (
    <>
      {/* ===== ACTION BUTTON ===== */}
      <button
        ref={buttonRef}
        onClick={openMenu}
        className="opacity-60 hover:opacity-100 transition"
        aria-label="More actions"
      >
        <Image src="/more.png" alt="" width={18} height={18} />
      </button>

      {/* ================= DESKTOP POPOVER ================= */}
      {!isMobile && open && coords &&
        createPortal(
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setOpen(false)}
          >
            <div
              style={{ top: coords.top, left: coords.left }}
              onClick={(e) => e.stopPropagation()}
              className="
                absolute
                w-48
                bg-white
                border
                rounded-xl
                shadow-xl
                overflow-hidden
                animate-fadeIn
              "
            >
              <MenuContent role={role} />
            </div>
          </div>,
          document.body
        )}

      {/* ================= MOBILE BOTTOM SHEET ================= */}
      {isMobile && open && (
        <div className="fixed inset-0 z-[999] bg-black/40">
          <div
            className="
              absolute bottom-0 left-0 right-0
              bg-white
              rounded-t-2xl
              p-4
              animate-slideUp
            "
          >
            <div className="w-10 h-1 bg-gray-300 rounded mx-auto mb-4" />
            <MenuContent role={role} mobile />
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= MENU ================= */

function MenuContent({
  role,
  mobile = false,
}: {
  role: Props["role"];
  mobile?: boolean;
}) {
  return (
    <div className={`text-sm ${mobile ? "space-y-1" : ""}`}>
      <MenuItem label="View details" />
      <MenuItem label="Export data" disabled />
      {role === "admin" && (
        <MenuItem label="Manage permissions" disabled />
      )}
      <div className="px-4 py-2 text-xs text-gray-400">
        More actions coming soon
      </div>
    </div>
  );
}

function MenuItem({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`
        px-4 py-2
        ${
          disabled
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        }
      `}
    >
      {label}
    </div>
  );
}
