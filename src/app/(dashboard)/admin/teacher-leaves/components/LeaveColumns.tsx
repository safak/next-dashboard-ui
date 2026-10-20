"use client";

import Image from "next/image";
import { Eye, Calendar, Pencil } from "lucide-react";

import StatusBadge from "@/components/admin/StatusBadge";
import { Column } from "@/components/admin/DataTable";

export interface Leave {
  id: number;

  teacherId: string;

  teacherName: string;

  teacherImage: string | null;

  phone: string | null;

  email: string | null;

  leaveDate: string;

  leaveType: string;

  duration: string;

  reason: string;

  status: string;

  approvedBy: string | null;

  approvedAt: string | null;

  rejectionReason: string | null;
}

interface Props {
  onView: (leave: Leave) => void;
}

export default function LeaveColumns({
  onView,
}: Props): Column<Leave>[] {
  return [
    {
      key: "teacher",
      title: "Teacher",
      width: "28%",
      render: (leave) => (
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border bg-slate-100">
            {leave.teacherImage ? (
              <Image
                src={leave.teacherImage}
                alt={leave.teacherName ?? "Teacher"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-slate-600">
                {leave.teacherName?.charAt(0).toUpperCase() ?? "T"}
              </div>
            )}
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              {leave.teacherName ?? "Unknown Teacher"}
            </p>

            <p className="text-[9px] text-slate-500">
              {leave.email ?? "No email"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "leaveDate",
      title: "Leave Date",
      width: "14%",
      align: "center",
      render: (leave) => (
        <div className="flex items-center justify-center gap-1 text-slate-700 text-[12px]">
          <Calendar size={12} />

          <span>
            {new Date(leave.leaveDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },

    {
      key: "leaveType",
      title: "Type",
      width: "14%",
      align: "center",
      render: (leave) => (
        <span className="font-medium text-[12px]">
          {leave.leaveType}
        </span>
      ),
    },

    {
      key: "duration",
      title: "Duration",
      width: "14%",
      align: "center",
      render: (leave) => (
        <span className="text-[12px]">{leave.duration}</span>
      ),
    },

    {
      key: "status",
      title: "Status",
      width: "14%",
      align: "center",
      render: (leave) => (
        <StatusBadge status={leave.status} />
      ),
    },

    {
      key: "action",
      title: "Action",
      width: "16%",
      align: "center",
      render: (leave) => {
        const pending = leave.status === "PENDING";

        return (
          <button
            onClick={() => onView(leave)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-medium
              text-white transition ${
              pending
                ? "bg-violet-600 hover:bg-violet-700"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {pending ? (
              <>
                <Eye size={12} />
                Review
              </>
            ) : (
              <>
                <Pencil size={12} />
                View
              </>
            )}
          </button>
        );
      },
    },
  ];
}