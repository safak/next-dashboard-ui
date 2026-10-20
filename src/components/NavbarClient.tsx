"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import Image from "next/image";

import NotificationBell from "@/components/admin/NotificationBell";

const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  {
    ssr: false,
  },
);

type Role = "admin" | "teacher" | "student" | "parent";

type NavbarData = {
  fullName: string;
  role: string;
  unreadNotifications: number;
};

interface NavbarClientProps {
  role: Role;
  onMenuClick?: () => void;
}

export default function NavbarClient({ role, onMenuClick }: NavbarClientProps) {
  const [data, setData] = useState<NavbarData | null>(null);

  useEffect(() => {
    fetch("/api/navbar", {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load navbar data");
        }

        return res.json();
      })
      .then(setData)
      .catch(() => {
        setData({
          fullName: "",
          role: "",
          unreadNotifications: 0,
        });
      });
  }, []);

  return (
    <nav
      className="
        relative
        flex
        h-12
        shrink-0
        items-center
        overflow-visible
        bg-[#464B71]
        shadow-sm
        sm:h-14
      "
    >
      {/* Decorative Background */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 56"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M730 0H1000V56H650C694 48 722 29 730 0Z" fill="#B87938" />

          <path d="M765 0H1000V56H685C729 47 757 27 765 0Z" fill="#FF9100" />
        </svg>
      </div>

      {/* Navbar Content */}

      <div
        className="
          relative
          z-10
          flex
          h-full
          w-full
          items-center
          px-3
          sm:px-4
        "
      >
        <div className="flex min-w-0 items-center">
          {role === "teacher" || role === "parent" ? (
            <div className="flex min-w-0 items-center gap-2">
              <Image
                src="/TSLogo.png"
                alt="TrueSunshine"
                width={30}
                height={30}
                className="h-7 w-7 shrink-0 rounded-md object-contain"
              />

              <span className="truncate text-sm font-bold tracking-tight text-white">
                TrueSunshine
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-white/10 active:scale-95 md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Right Controls */}

        <div
          className="
            ml-auto
            flex
            h-full
            items-center
            gap-2
            sm:gap-3
          "
        >
          {/* Notification */}

          <div className="relative z-30 flex items-center justify-center">
            <NotificationBell role={role} />
          </div>

          {/* User Information */}

          <div className="hidden items-center sm:flex">
            <div className="text-right leading-tight">
              <p className="max-w-[190px] truncate text-xs font-semibold text-white">
                {data?.fullName || "User"}
              </p>

              <p className="mt-0.5 text-[10px] font-medium capitalize text-white/80">
                {data?.role || role}
              </p>
            </div>
          </div>

          {/* Clerk User Button */}

          <div
            className="
              relative
              z-30
              flex
              h-[34px]
              w-[34px]
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-white
              shadow-sm
              ring-1
              ring-white/80
              sm:h-10
              sm:w-10
              sm:ring-2
              sm:ring-white/60
            "
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-[30px] w-[30px] sm:h-9 sm:w-9",
                  userButtonAvatarBox: "h-[30px] w-[30px] sm:h-9 sm:w-9",
                  userButtonPopoverCard:
                    "rounded-xl border border-slate-200 shadow-xl",
                },
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
