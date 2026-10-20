"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import Menu from "@/components/Menu";
import NavbarClient from "@/components/NavbarClient";
import TeacherMobileBottomNav from "@/components/mobile/teacher/TeacherMobileBottomNav";

type Role = "admin" | "teacher" | "student" | "parent";

interface DashboardShellProps {
  children: ReactNode;
  role: Role;
}

export default function DashboardShell({
  children,
  role,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F7F8FA]">
      {/* ================= DESKTOP SIDEBAR ================= */}

      <aside
        className="
          relative
          hidden
          h-screen
          w-[235px]
          shrink-0
          flex-col
          overflow-hidden
          border-r
          border-white/10
          bg-[#464B71]
          px-2.5
          py-3
          shadow-xl
          lg:flex
        "
      >
        <div className="pointer-events-none absolute inset-0 z-0">
          <svg
            className="absolute bottom-0 left-0 h-[120px] w-full"
            viewBox="0 0 235 120"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 55C30 45 52 48 72 68C91 87 103 108 119 120H0V55Z"
              fill="#B87938"
            />

            <path
              d="M78 120C119 105 153 84 177 59C201 34 216 12 235 0V120H78Z"
              fill="#FF9100"
            />
          </svg>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <Link href="/" className="mb-4 flex items-center gap-2 px-2">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white
                shadow-sm
              "
            >
              <Image
                src="/TSLogo.png"
                alt="TrueSunshine"
                width={27}
                height={27}
                className="object-contain"
              />
            </div>

            <span className="text-[15px] font-bold tracking-tight text-white">
              TrueSunshine
            </span>
          </Link>

          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
            <Menu mode="desktop" role={role} />
          </div>
        </div>
      </aside>

      {/* ================= MOBILE MENU ================= */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="
              absolute
              inset-0
              bg-black/45
              backdrop-blur-[2px]
            "
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside
            className="
              absolute
              left-0
              top-0
              h-full
              w-[235px]
              overflow-hidden
              bg-[#464B71]
              px-2.5
              py-3
              shadow-2xl
            "
          >
            <div className="pointer-events-none absolute inset-0 z-0">
              <svg
                className="absolute bottom-0 left-0 h-[150px] w-full"
                viewBox="0 0 235 150"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 78C35 67 58 80 79 103C96 122 114 145 153 150H0V78Z"
                  fill="#B87938"
                />

                <path
                  d="M235 36C211 66 197 91 168 111C145 127 124 140 103 150H235V36Z"
                  fill="#FF9100"
                />

                <path
                  d="M235 70C216 89 198 105 178 118C155 133 131 144 111 150H235V70Z"
                  fill="#FF9100"
                />
              </svg>
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="mb-4 flex items-center gap-2 px-2"
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    shadow-sm
                  "
                >
                  <Image
                    src="/TSLogo.png"
                    alt="TrueSunshine"
                    width={27}
                    height={27}
                    className="object-contain"
                  />
                </div>

                <span className="text-[15px] font-bold tracking-tight text-white">
                  TrueSunshine
                </span>
              </Link>

              <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto">
                <Menu
                  mode="mobile"
                  role={role}
                  onItemClick={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ================= MAIN APPLICATION AREA ================= */}

      <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-[100] shrink-0">
          <NavbarClient
            role={role}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
        </div>

        <main
          className="
            relative
            z-0
            min-w-0
            max-w-full
            flex-1
            overflow-x-hidden
            overflow-y-auto
            pb-24
            lg:p-3
            lg:pb-3
          "
        >
          {children}
        </main>
      </section>

      {/* ================= TEACHER MOBILE BOTTOM NAVIGATION ================= */}

      {role === "teacher" && (
        <div className="teacher-mobile-bottom-nav lg:hidden">
          <TeacherMobileBottomNav />
        </div>
      )}
    </div>
  );
}
