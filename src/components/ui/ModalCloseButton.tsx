"use client";

import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function ModalCloseButton({ onClose }: Props) {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClose}
      className="
        absolute sm:right-[6px] right-1 top-[4px] sm:top-[6px] h-5 w-5 rounded-full bg-black flex items-center justify-center text-white
        transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/40">
      <X className="h-2 w-2 sm:h-4 sm:w-4 font-extrabold" />
    </button>
  );
}