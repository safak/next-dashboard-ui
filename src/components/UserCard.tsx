import prisma from "@/lib/prisma";
import UserCardActions from "@/components/UserCardActions";
import { Shield, Users, GraduationCap, User } from "lucide-react";

/* ================= HELPERS ================= */

function getAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const startYear = month >= 6 ? year : year - 1;
  const endYear = startYear + 1;

  return `${startYear}/${String(endYear).slice(-2)}`;
}

const ROLE_STYLES = {
  admin: {
    bg: "bg-gradient-to-br from-rose-50 to-rose-100/60",
    icon: "text-rose-600",
    Icon: Shield,
  },
  teacher: {
    bg: "bg-gradient-to-br from-violet-50 to-violet-100/60",
    icon: "text-violet-600",
    Icon: Users,
  },
  student: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100/60",
    icon: "text-blue-600",
    Icon: GraduationCap,
  },
  parent: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60",
    icon: "text-emerald-600",
    Icon: User,
  },
};

/* ================= COMPONENT ================= */

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();
  const academicYear = getAcademicYear();
  const styles = ROLE_STYLES[type];
  const Icon = styles.Icon;

  return (
    <div
      className={`
    ${styles.bg}
    relative
    rounded-2xl
    p-4
    h-[120px]
    border border-gray-200
    shadow-sm
    flex flex-col justify-between
    transition-all duration-300
    hover:-translate-y-1 hover:shadow-lg
    overflow-hidden
  `}
    >
      {/* ROW 1 : YEAR + OPTIONS */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-400">
          {academicYear}
        </span>

        <UserCardActions role={type} />
      </div>

      {/* ROW 2 : TITLE */}
      <span className="text-xs font-medium text-gray-600 capitalize">
        {type}s
      </span>

      {/* ROW 3 : VALUE + ICON */}
      <div className="flex items-end justify-between">
        <span className="text-base lg:text-lg font-semibold text-gray-900">
          {data}
        </span>

        <div
          className={`w-9 h-9 flex items-center justify-center rounded-lg shadow-sm ${styles.icon}`}
        >
          <Icon size={14} />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
