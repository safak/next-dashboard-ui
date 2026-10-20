"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import StudentModuleNavigation from "./components/StudentModuleNavigation";
import ModuleHeader, { type Breadcrumb } from "./components/ModuleHeader";

interface Workspace {
  title: string;
  description: string;

  button?: {
    text: string;
    href: string;
  };

  Navigation?: React.ComponentType;

  hideNavigation?: boolean;
}

export default function StudentsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // --------------------------------------------------
  // Student Workspaces
  // --------------------------------------------------

  const workspaces: Workspace[] = [
    {
      title: "Admissions Register",
      description: "Manage all student admission records.",

      button: {
        text: "New Admission",
        href: "/admin/students/admissions/new",
      },
    },

    {
      title: "Archived Students",
      description: "Manage inactive and archived student records.",

      button: {
        text: "Archived List",
        href: "/admin/students/archived",
      },
    },

    {
      title: "Promotions",
      description: "Promote students to the next academic year.",

      button: {
        text: "Start Promotion",
        href: "/admin/students/promotion",
      },
    },

    {
      title: "Student ID Cards",
      description: "Generate and print student identity cards.",

      button: {
        text: "Generate",
        href: "/admin/students/id-cards",
      },
    },

    {
      title: "Student Reports",
      description: "Analytics, exports and student insights.",
    },

    {
      title: "Transfer Certificates",
      description: "Generate and issue transfer certificates.",
    },
  ];

  // --------------------------------------------------
  // Default Workspace
  // --------------------------------------------------

  let workspace: Workspace = {
    title: "Students",
    description: "Manage enrolled students and student lifecycle.",

    button: {
      text: "Add Student",
      href: "/admin/admissions/new",
    },

    Navigation: StudentModuleNavigation,
  };

  // --------------------------------------------------
  // Breadcrumbs
  // --------------------------------------------------

  let breadcrumbs: Breadcrumb[] = [];

  // --------------------------------------------------
  // Admissions
  // --------------------------------------------------

  if (pathname.startsWith("/admin/students/admissions")) {
    const isNewAdmission = pathname.startsWith(
      "/admin/students/admissions/new",
    );

    workspace = {
      ...workspaces[0],

      title: isNewAdmission ? "New Student Admission" : workspaces[0].title,

      description: isNewAdmission
        ? "Complete the student admission process."
        : workspaces[0].description,

      hideNavigation: isNewAdmission,

      button: isNewAdmission ? undefined : workspaces[0].button,
    };

    breadcrumbs = [
      {
        label: "Students",
        href: "/admin/students",
      },
      {
        label: "Admissions",
        href: "/admin/students/admissions",
      },
    ];

    if (isNewAdmission) {
      breadcrumbs.push({
        label: "New Admission",
      });
    }
  }

  // --------------------------------------------------
  // Archived
  // --------------------------------------------------
  else if (pathname.startsWith("/admin/students/archived")) {
    workspace = workspaces[1];

    breadcrumbs = [
      {
        label: "Students",
        href: "/admin/students",
      },
      {
        label: "Archived Students",
      },
    ];
  }

  // --------------------------------------------------
  // Promotion
  // --------------------------------------------------
  else if (pathname.startsWith("/admin/students/promotion")) {
    workspace = workspaces[2];

    breadcrumbs = [
      {
        label: "Students",
        href: "/admin/students",
      },
      {
        label: "Promotion",
      },
    ];
  }

  // --------------------------------------------------
  // ID Cards
  // --------------------------------------------------
  else if (pathname.startsWith("/admin/students/id-cards")) {
    workspace = workspaces[3];

    breadcrumbs = [
      {
        label: "Students",
        href: "/admin/students",
      },
      {
        label: "ID Cards",
      },
    ];
  }

  // --------------------------------------------------
  // Reports
  // --------------------------------------------------
  else if (pathname.startsWith("/admin/students/reports")) {
    workspace = workspaces[4];

    breadcrumbs = [
      {
        label: "Students",
        href: "/admin/students",
      },
      {
        label: "Reports",
      },
    ];
  }

  // --------------------------------------------------
  // Transfer Certificates
  // --------------------------------------------------
  else if (pathname.startsWith("/admin/students/transfer-certificates")) {
    workspace = workspaces[5];

    breadcrumbs = [
      {
        label: "Students",
        href: "/admin/students",
      },
      {
        label: "Transfer Certificates",
      },
    ];
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-4">
      <ModuleHeader
        breadcrumbs={breadcrumbs}
        title={workspace.title}
        description={workspace.description}
        image="/students-icon.png"
        imageClassName="h-10 w-10"
        action={
          workspace.button ? (
            <Link href={workspace.button.href}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="mr-2 h-4 w-4" />
                {workspace.button.text}
              </Button>
            </Link>
          ) : undefined
        }
      />

      {/* --------------------------------------------------
          Module Navigation
      -------------------------------------------------- */}

      {!workspace.hideNavigation && workspace.Navigation && (
        <workspace.Navigation />
      )}

      {/* --------------------------------------------------
          Page Content
      -------------------------------------------------- */}

      {children}
    </div>
  );
}
