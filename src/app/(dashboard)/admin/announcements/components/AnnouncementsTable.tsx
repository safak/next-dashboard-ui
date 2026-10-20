"use client";

import { Bell, CalendarDays, GraduationCap, Send } from "lucide-react";

import AnnouncementRowActions from "./AnnouncementRowActions";

import type { AnnouncementRow } from "../types";

interface AnnouncementsTableProps {
  announcements: AnnouncementRow[];

  onEdit: (announcement: AnnouncementRow) => void;

  onDelete: (announcement: AnnouncementRow) => void;
}

const priorityStyles: Record<AnnouncementRow["priority"], string> = {
  LOW: "bg-slate-100 text-slate-600",
  NORMAL: "bg-blue-50 text-blue-700",
  HIGH: "bg-amber-50 text-amber-700",
  URGENT: "bg-red-50 text-red-700",
};

function getStatus(announcement: AnnouncementRow) {
  const expired =
    announcement.expiryDate &&
    new Date(announcement.expiryDate).getTime() < Date.now();

  if (expired) {
    return {
      label: "Expired",
      className: "bg-red-50 text-red-700",
    };
  }

  if (announcement.isPublished) {
    return {
      label: "Published",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: "Draft",
    className: "bg-slate-100 text-slate-600",
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function AnnouncementsTable({
  announcements,
  onEdit,
  onDelete,
}: AnnouncementsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {/* Announcement */}

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Announcement
                </span>
              </th>

              {/* Class */}

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Class
                </span>
              </th>

              {/* Priority */}

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Priority
                </span>
              </th>

              {/* Publish Date */}

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Publish Date
                </span>
              </th>

              {/* Status */}

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </span>
              </th>

              {/* WhatsApp */}

              <th className="px-5 py-3 text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  WhatsApp
                </span>
              </th>

              {/* Actions */}

              <th className="px-5 py-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {announcements.map((announcement) => {
              const status = getStatus(announcement);

              return (
                <tr
                  key={announcement.id}
                  className="
                    group
                    border-b
                    border-slate-100
                    last:border-b-0
                    transition-colors
                    duration-150
                    hover:bg-indigo-50/30
                  "
                >
                  {/* Announcement */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-violet-50
                          text-violet-600
                          transition-transform
                          duration-150
                          group-hover:scale-105
                        "
                      >
                        <Bell className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[300px] truncate text-sm font-semibold leading-5 text-slate-900">
                          {announcement.title}
                        </p>

                        <p className="max-w-[300px] truncate text-[11px] leading-4 text-slate-400">
                          {announcement.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Class */}

                  <td className="px-5 py-2.5">
                    {announcement.class ? (
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                          <GraduationCap className="h-3.5 w-3.5" />
                        </div>

                        <span className="text-sm font-medium text-slate-800">
                          {announcement.class.name}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        All Classes
                      </span>
                    )}
                  </td>

                  {/* Priority */}

                  <td className="px-5 py-2.5">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-wide
                        ${priorityStyles[announcement.priority]}
                      `}
                    >
                      {announcement.priority}
                    </span>
                  </td>

                  {/* Publish Date */}

                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {formatDate(announcement.publishDate)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}

                  <td className="px-5 py-2.5">
                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[11px]
                        font-bold
                        ${status.className}
                      `}
                    >
                      {status.label}
                    </span>
                  </td>

                  {/* WhatsApp */}

                  <td className="px-5 py-2.5">
                    {announcement.whatsappSent ? (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <Send className="h-3.5 w-3.5" />

                        <span className="text-xs font-semibold">Sent</span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        Not sent
                      </span>
                    )}
                  </td>

                  {/* Actions */}

                  <td className="px-5 py-2.5 text-center">
                    <div className="flex justify-center">
                      <AnnouncementRowActions
                        announcement={announcement}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {/* Empty Table State */}

            {announcements.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Bell className="h-5 w-5 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      No announcements found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      There are no announcement records to display.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
