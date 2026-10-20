"use client";

import { ReactNode } from "react";
import { Archive, LucideIcon } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: ReactNode;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;

  onConfirm: () => void;

  // Optional icon
  icon?: LucideIcon;
  iconClassName?: string;
  iconBackgroundClassName?: string;

  // Confirm button
  confirmButtonClassName?: string;

  // Optional illustration
  illustrationSrc?: string;
  illustrationAlt?: string;
  illustrationClassName?: string;
}

export default function ConfirmDialog({
  open,
  onOpenChange,

  title,
  description,

  confirmText = "Confirm",
  cancelText = "Cancel",

  loading = false,

  onConfirm,

  icon: Icon = Archive,
  iconClassName = "text-amber-600",
  iconBackgroundClassName = "bg-amber-100",

  confirmButtonClassName = "bg-red-600 hover:bg-red-700",

  illustrationSrc,
  illustrationAlt = "Confirmation illustration",
  illustrationClassName = "h-36 w-auto",
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
          w-[calc(100%-2rem)]
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-0
          shadow-2xl
        "
      >
        {/* ==================================================
            ILLUSTRATION
        ================================================== */}

        {illustrationSrc && (
          <div
            className="
              flex
              items-center
              justify-center
              bg-gradient-to-b
              from-indigo-50
              via-white
              to-white
              px-6
              pt-4
              pb-0
            "
          >
            <Image
              src={illustrationSrc}
              alt={illustrationAlt}
              className={`
                object-contain
                object-center
                ${illustrationClassName}
              `}
            />
          </div>
        )}

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="px-6 pb-5 pt-2">
          <AlertDialogHeader className="text-left">
            {/* Fallback icon when no illustration is supplied */}
            {!illustrationSrc && (
              <div
                className={`
                  mb-4
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  ${iconBackgroundClassName}
                `}
              >
                <Icon className={`h-4 w-4 ${iconClassName}`} />
              </div>
            )}

            <AlertDialogTitle
              className="
                text-lg
                font-semibold
                tracking-tight
                text-slate-900
              "
            >
              {title}
            </AlertDialogTitle>

            <AlertDialogDescription
              asChild
              className="mt-2"
            >
              <div
                className="
                  text-sm
                  leading-6
                  text-slate-500
                "
              >
                {description}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <AlertDialogFooter className="mt-6 flex-row justify-end gap-2">
            <AlertDialogCancel
              disabled={loading}
              className="
                mt-0
                h-10
                rounded-lg
                border-slate-200
                bg-white
                px-4
                text-sm
                font-medium
                text-slate-700
                shadow-sm
                hover:bg-slate-50
              "
            >
              {cancelText}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={onConfirm}
              disabled={loading}
              className={`
                h-10
                rounded-lg
                px-4
                text-sm
                font-medium
                text-white
                shadow-sm
                ${confirmButtonClassName}
              `}
            >
              {loading ? "Please wait..." : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}