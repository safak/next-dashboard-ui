"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Megaphone,
  CalendarDays,
  Wallet,
  BookOpen,
  FileText,
  GraduationCap,
  X,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";

export interface Notification {
  id: number | string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  referenceId?: number | null;
  createdAt: string;
}

interface Props {
  open: boolean;
  notifications: Notification[];
  onReview: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  onViewAll?: () => void;
}

const notificationConfig: Record<
  string,
  {
    icon: any;
    bg: string;
    iconColor: string;
  }
> = {
  TEACHER_LEAVE: {
    icon: ClipboardList,
    bg: "bg-[#FFF3E3]",
    iconColor: "text-[#FF9100]",
  },

  LEAVE_APPROVED: {
    icon: CheckCircle2,
    bg: "bg-[#EAF8EF]",
    iconColor: "text-[#159447]",
  },

  LEAVE_REJECTED: {
    icon: XCircle,
    bg: "bg-[#FFF0ED]",
    iconColor: "text-[#C94B35]",
  },

  ANNOUNCEMENT: {
    icon: Megaphone,
    bg: "bg-[#FFF3E3]",
    iconColor: "text-[#C87512]",
  },

  EVENT: {
    icon: CalendarDays,
    bg: "bg-[#FFF5E9]",
    iconColor: "text-[#E58A18]",
  },

  FEE: {
    icon: Wallet,
    bg: "bg-[#EAF8EF]",
    iconColor: "text-[#159447]",
  },

  HOMEWORK: {
    icon: BookOpen,
    bg: "bg-[#EEF2FF]",
    iconColor: "text-[#4B517D]",
  },

  ASSIGNMENT: {
    icon: FileText,
    bg: "bg-[#F8F0E7]",
    iconColor: "text-[#9A642F]",
  },

  EXAM: {
    icon: FileText,
    bg: "bg-[#FFF0ED]",
    iconColor: "text-[#C94B35]",
  },

  RESULT: {
    icon: GraduationCap,
    bg: "bg-[#EAF8EF]",
    iconColor: "text-[#159447]",
  },
};

export default function NotificationDropdown({
  open,
  notifications,
  onReview,
  onMarkAllAsRead,
  onViewAll,
}: Props) {
  const [clearedIds, setClearedIds] = useState<Set<string | number>>(new Set());

  const visibleNotifications = useMemo(() => {
    return notifications.filter(
      (notification) => !clearedIds.has(notification.id),
    );
  }, [notifications, clearedIds]);

  const unread = visibleNotifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const handleClear = () => {
    setClearedIds(
      new Set(visibleNotifications.map((notification) => notification.id)),
    );
  };

  return (
    <div
      className={`
        absolute
        right-0
        top-[calc(100%+8px)]
        z-[9999]
        w-[320px]
        max-w-[calc(100vw-20px)]
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-[0_16px_40px_rgba(0,0,0,0.16)]
        transition-all
        duration-200
        ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-2 opacity-0"
        }
      `}
    >
      <div className="relative bg-[#464B71] px-3.5 py-3 text-white">
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#FF9100]" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <Bell className="h-4 w-4 text-white" strokeWidth={2} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold">Notifications</h3>

              <p className="mt-0.5 truncate text-[9px] text-white/60">
                {unread > 0
                  ? `${unread} unread notification${unread !== 1 ? "s" : ""}`
                  : "Stay up to date"}
              </p>
            </div>
          </div>

          {visibleNotifications.length > 0 && (
            <div className="flex shrink-0 items-center gap-1.5">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="rounded-lg bg-[#FF9100] px-2.5 py-1.5 text-[9px] font-semibold text-white transition hover:bg-[#E98200] active:scale-95"
                >
                  Mark all
                </button>
              )}

              <button
                type="button"
                onClick={handleClear}
                title="Clear notifications from this dropdown"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white active:scale-95"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-h-[280px] overflow-y-auto bg-white scrollbar-hide">
        {visibleNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF]">
              <Bell className="h-5 w-5 text-[#C8D0E3]" strokeWidth={1.7} />
            </div>

            <p className="mt-3 text-[12px] font-semibold text-[#4B517D]">
              No notifications
            </p>

            <p className="mt-1 text-[9px] text-slate-400">
              You&apos;re all caught up
            </p>
          </div>
        ) : (
          visibleNotifications.map((notification) => {
            const config = notificationConfig[notification.type] ?? {
              icon: Bell,
              bg: "bg-slate-100",
              iconColor: "text-slate-500",
            };

            const Icon = config.icon;

            const isLeaveDecision =
              notification.type === "LEAVE_APPROVED" ||
              notification.type === "LEAVE_REJECTED";

            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => onReview(notification)}
                className={`
                  relative block w-full border-b border-slate-100
                  px-3 py-2.5 text-left
                  transition-colors
                  hover:bg-[#F8FAFC]
                  active:bg-slate-50
                  ${!notification.isRead ? "bg-[#FFF9F1]" : "bg-white"}
                `}
              >
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-[#FF9100]" />
                )}

                <div className="flex items-start gap-2.5">
                  <div
                    className={`
                      mt-0.5 flex h-8 w-8 shrink-0
                      items-center justify-center rounded-lg
                      ${config.bg}
                    `}
                  >
                    <Icon
                      className={config.iconColor}
                      size={14}
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`
                          min-w-0 flex-1 truncate
                          text-[11px] leading-4 text-[#30354D]
                          ${
                            !notification.isRead ? "font-bold" : "font-semibold"
                          }
                        `}
                      >
                        {notification.title}
                      </h4>

                      {notification.type === "TEACHER_LEAVE" && (
                        <span className="shrink-0 rounded-md bg-[#FF9100] px-1.5 py-0.5 text-[8px] font-bold text-white">
                          Review
                        </span>
                      )}

                      {notification.type === "LEAVE_APPROVED" && (
                        <span className="shrink-0 rounded-md bg-[#EAF8EF] px-1.5 py-0.5 text-[8px] font-bold text-[#159447]">
                          Approved
                        </span>
                      )}

                      {notification.type === "LEAVE_REJECTED" && (
                        <span className="shrink-0 rounded-md bg-[#FFF0ED] px-1.5 py-0.5 text-[8px] font-bold text-[#C94B35]">
                          Rejected
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 line-clamp-1 text-[9px] leading-3.5 text-slate-600">
                      {notification.message}
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-[8px] font-medium text-slate-400">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>

                      {isLeaveDecision && (
                        <span className="text-[8px] font-medium text-[#4B517D]">
                          View attendance
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {visibleNotifications.length > 0 && (
        <div className="border-t border-slate-100 bg-[#F8FAFC]">
          <button
            type="button"
            onClick={onViewAll}
            className="flex w-full items-center justify-center px-3 py-2.5 text-[9px] font-semibold text-[#4B517D] transition hover:bg-[#EEF2FF]"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
