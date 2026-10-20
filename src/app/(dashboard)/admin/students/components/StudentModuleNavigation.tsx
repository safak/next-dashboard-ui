"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Users, UserPlus, Archive, ArrowUpCircle } from "lucide-react";

import SummaryCard from "@/components/admin/SummaryCard";

interface NavigationCounts {
  totalStudents: number;
  admissions: number;
  archived: number;
}

export default function StudentModuleNavigation() {
  const pathname = usePathname();

  const [counts, setCounts] = useState<NavigationCounts>({
    totalStudents: 0,
    admissions: 0,
    archived: 0,
  });

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // Load Navigation Counts
  // --------------------------------------------------

  useEffect(() => {
    async function loadNavigationCounts() {
      try {
        const res = await fetch("/api/admin/students/navigation", {
          cache: "no-store",
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        setCounts({
          totalStudents: data.totalStudents ?? 0,
          admissions: data.admissions ?? 0,
          archived: data.archived ?? 0,
        });
      } catch (error) {
        console.error("Failed to load student navigation counts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNavigationCounts();
  }, []);

  // --------------------------------------------------
  // Student Modules
  // --------------------------------------------------

  const modules = [
    {
      title: "All Students",
      href: "/admin/students",
      icon: Users,
      color: "blue" as const,
      value: counts.totalStudents,
    },
    {
      title: "Admissions",
      href: "/admin/students/admissions",
      icon: UserPlus,
      color: "green" as const,
      value: counts.admissions,
    },
    {
      title: "Archived",
      href: "/admin/students/archived",
      icon: Archive,
      color: "red" as const,
      value: counts.archived,
    },
    {
      title: "Promotion",
      href: "/admin/students/promotion",
      icon: ArrowUpCircle,
      color: "purple" as const,
      value: "—",
    },
  ];

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
      {modules.map((module) => {
        const active =
          pathname === module.href ||
          (module.href !== "/admin/students" &&
            pathname.startsWith(module.href));

        const displayValue =
          module.value === "—"
            ? "—"
            : loading
              ? "..."
              : module.value.toLocaleString();

        return (
          <Link
            key={module.href}
            href={module.href}
            aria-current={active ? "page" : undefined}
            className={`
        block
        rounded-2xl
        transition-all
        duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-500
        focus-visible:ring-offset-2
      `}
          >
            <SummaryCard
              title={module.title}
              value={displayValue}
              icon={module.icon}
              color={module.color}
              compact
            />
          </Link>
        );
      })}
    </div>
  );
}
