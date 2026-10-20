import {
  CheckCircle2,
  XCircle,
  Clock3,
  Plane,
} from "lucide-react";

export const ATTENDANCE_STATUSES = [
  {
    value: "PRESENT",
    label: "Present",
    icon: CheckCircle2,
    color: "text-green-600",
    border: "border-green-500",
    bg: "bg-green-50",
  },
  {
    value: "ABSENT",
    label: "Absent",
    icon: XCircle,
    color: "text-red-600",
    border: "border-red-500",
    bg: "bg-red-50",
  },
  {
    value: "LATE",
    label: "Late",
    icon: Clock3,
    color: "text-yellow-600",
    border: "border-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    value: "LEAVE",
    label: "Leave",
    icon: Plane,
    color: "text-blue-600",
    border: "border-blue-500",
    bg: "bg-blue-50",
  },
] as const;