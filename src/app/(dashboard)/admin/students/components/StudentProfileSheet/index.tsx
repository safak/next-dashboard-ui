"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import type { Student } from "@/types/student";

import ProfileHeader from "./ProfileHeader";
import PersonalTab from "./tabs/PersonalTab";
import AcademicTab from "./tabs/AcademicTab";
import ParentTab from "./tabs/ParentTab";
import FeesTab from "./tabs/FeesTab";
import AttendanceTab from "./tabs/AttendanceTab";
import DocumentsTab from "./tabs/DocumentsTab";

interface StudentProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
}

const tabs = [
  {
    id: "personal",
    label: "Personal",
  },
  {
    id: "academic",
    label: "Academic",
  },
  {
    id: "parent",
    label: "Parent",
  },
  {
    id: "fees",
    label: "Fees",
  },
  {
    id: "attendance",
    label: "Attendance",
  },
  {
    id: "documents",
    label: "Documents",
  }
];

export default function StudentProfileSheet({
  open,
  onOpenChange,
  student,
}: StudentProfileSheetProps) {
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (open) setActiveTab("personal");
  }, [open]);

  if (!student) return null;

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Student Profile"
      description="View complete student information."
      width="lg"
      icon={<UserRound className="h-6 w-6" />}
      footer={
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <ProfileHeader student={student} />

      <div className="mt-1 border-b">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 py-4 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        {activeTab === "personal" && <PersonalTab student={student} />}
        {activeTab === "academic" && <AcademicTab student={student} />}
        {activeTab === "parent" && <ParentTab student={student} />}
        {activeTab === "fees" && <FeesTab student={student} />}
        {activeTab === "attendance" && <AttendanceTab student={student} />}
        {activeTab === "documents" && <DocumentsTab student={student} />}
      </div>
    </Drawer>
  );
}
