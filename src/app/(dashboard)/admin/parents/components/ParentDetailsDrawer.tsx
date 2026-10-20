"use client";

import { AtSign, Mail, MapPin, Phone, UserRound, Users, X } from "lucide-react";

import Drawer from "@/components/ui/Drawer";
import { Button } from "@/components/ui/button";

import type { ParentRow } from "./types";

interface ParentDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parent: ParentRow | null;
}

export default function ParentDetailsDrawer({
  open,
  onOpenChange,
  parent,
}: ParentDetailsDrawerProps) {
  if (!parent) {
    return null;
  }

  const fullName = `${parent.name ?? ""} ${parent.surname ?? ""}`.trim();

  const students = parent.students ?? [];
  const studentCount = parent._count?.students ?? students.length;

  return (
    <Drawer
      open={open}
      onClose={() => onOpenChange(false)}
      title="Parent Details"
      description="View the details of this parent account."
      width="md"
      icon={<UserRound className="h-6 w-6" />}
      footer={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="rounded-xl"
        >
          <X className="mr-2 h-4 w-4" />
          Close
        </Button>
      }
    >
      <div className="space-y-3.5">
        {/* ==================================================
            PROFILE OVERVIEW
        ================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <UserRound className="h-5 w-5" />
            </div>

            {/* Name */}

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-bold text-slate-900">
                {fullName || "Unnamed Parent"}
              </h2>

              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-sm text-slate-500">Parent Account</span>

                <span className="h-1 w-1 rounded-full bg-slate-300" />

                <span className="text-xs font-medium text-emerald-600">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            ACCOUNT INFORMATION
        ================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Account Information
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Login information associated with this parent.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Username */}

            <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <AtSign className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">
                  Username
                </span>
              </div>

              <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                {parent.username || "—"}
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">Parent login</p>
            </div>

            {/* Role */}

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <UserRound className="h-3.5 w-3.5" />
                </div>

                <span className="text-xs font-medium text-slate-500">Role</span>
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                Parent
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                School account
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            CONTACT INFORMATION
        ================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Contact Information
            </h3>

            <p className="mt-0.5 text-xs text-slate-500">
              Personal and contact details for this parent.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Full Name */}

            <div className="flex items-center gap-3 rounded-lg bg-indigo-50/60 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <UserRound className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500">
                  Full Name
                </p>

                <p className="truncate text-sm font-semibold text-slate-900">
                  {fullName || "—"}
                </p>
              </div>
            </div>

            {/* Email */}

            <div className="flex items-center gap-3 rounded-lg bg-blue-50/60 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Mail className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500">Email</p>

                <p className="truncate text-sm font-semibold text-slate-900">
                  {parent.email || "Not provided"}
                </p>
              </div>
            </div>

            {/* Phone */}

            <div className="flex items-center gap-3 rounded-lg bg-emerald-50/60 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Phone className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500">Phone</p>

                <p className="text-sm font-semibold text-slate-900">
                  {parent.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Address */}

            <div className="flex items-start gap-3 rounded-lg bg-amber-50/60 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <MapPin className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500">
                  Address
                </p>

                <p className="text-sm font-semibold leading-5 text-slate-900">
                  {parent.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            CHILDREN
        ================================================== */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Children</h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Students linked to this parent.
              </p>
            </div>

            <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-indigo-50 px-2 text-indigo-600">
              <Users className="h-4 w-4" />

              <span className="ml-1.5 text-xs font-bold">{studentCount}</span>
            </div>
          </div>

          {students.length > 0 ? (
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-lg
                    border
                    border-slate-100
                    bg-slate-50/70
                    px-3
                    py-2.5
                  "
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm">
                      <UserRound className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {student.name} {student.surname}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {student.class?.name ?? "No class assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 py-5 text-center">
              <Users className="mx-auto h-5 w-5 text-slate-400" />

              <p className="mt-2 text-xs font-medium text-slate-500">
                No students linked
              </p>
            </div>
          )}
        </div>

        {/* ==================================================
            QUICK SUMMARY
        ================================================== */}

        <div className="grid grid-cols-2 gap-3">
          {/* Account Status */}

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <UserRound className="h-3.5 w-3.5" />
              </div>

              <span className="text-xs font-medium text-slate-500">Status</span>
            </div>

            <p className="mt-2 text-lg font-bold text-slate-900">Active</p>
          </div>

          {/* Children */}

          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Users className="h-3.5 w-3.5" />
              </div>

              <span className="text-xs font-medium text-slate-500">
                Children
              </span>
            </div>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {studentCount}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
