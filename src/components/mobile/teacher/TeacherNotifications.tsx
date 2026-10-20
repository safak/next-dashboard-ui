"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ClipboardList,
  Megaphone,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface NotificationItem {
  id: string;
  refId: number | null;
  type:
    | "ANNOUNCEMENT"
    | "HOMEWORK"
    | "ASSIGNMENT"
    | "EXAM"
    | "LEAVE_APPROVED"
    | "LEAVE_REJECTED"
    | "GENERAL";
  title: string;
  message: string;
  className: string;
  date: string;
  isRead: boolean;
}

export default function TeacherNotifications() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/mobile/teacher/notifications");

      const data = await response.json();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openNotification = (item: NotificationItem) => {
    switch (item.type) {
      case "ANNOUNCEMENT":
        router.push(`/teacher/mobile/announcements/${item.refId}`);
        break;

      case "HOMEWORK":
        router.push(`/teacher/mobile/homework/${item.refId}`);
        break;

      case "ASSIGNMENT":
        router.push(`/teacher/mobile/assignments/${item.refId}`);
        break;

      case "EXAM":
        router.push(`/teacher/mobile/exams/${item.refId}`);
        break;

      case "LEAVE_APPROVED":
      case "LEAVE_REJECTED":
        router.push("/teacher/mobile/my-attendance");
        break;

      case "GENERAL":
        router.push("/teacher/mobile/notifications");
        break;
    }
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return <Megaphone size={20} className="text-[#C87512]" />;

      case "HOMEWORK":
        return <BookOpen size={20} className="text-[#4B517D]" />;

      case "ASSIGNMENT":
        return <ClipboardList size={20} className="text-[#B87938]" />;

      case "EXAM":
        return <FileText size={20} className="text-[#C94B35]" />;

      case "LEAVE_APPROVED":
        return <FileText size={20} className="text-[#159447]" />;

      case "LEAVE_REJECTED":
        return <FileText size={20} className="text-[#C94B35]" />;

      default:
        return <Bell size={20} className="text-[#4B517D]" />;
    }
  };

  const getIconBg = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return "bg-[#FFF3E3]";

      case "HOMEWORK":
        return "bg-[#EEF2FF]";

      case "ASSIGNMENT":
        return "bg-[#F8F0E7]";

      case "EXAM":
        return "bg-[#FFF0ED]";

      case "LEAVE_APPROVED":
        return "bg-[#EAF8EF]";

      case "LEAVE_REJECTED":
        return "bg-[#FFF0ED]";

      default:
        return "bg-slate-100";
    }
  };

  const getBadge = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return "bg-[#FFF3E3] text-[#C87512]";

      case "HOMEWORK":
        return "bg-[#EEF2FF] text-[#4B517D]";

      case "ASSIGNMENT":
        return "bg-[#F8F0E7] text-[#9A642F]";

      case "EXAM":
        return "bg-[#FFF0ED] text-[#C94B35]";

      case "LEAVE_APPROVED":
        return "bg-[#EAF8EF] text-[#159447]";

      case "LEAVE_REJECTED":
        return "bg-[#FFF0ED] text-[#C94B35]";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getTypeLabel = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ANNOUNCEMENT":
        return "Announcement";

      case "HOMEWORK":
        return "Homework";

      case "ASSIGNMENT":
        return "Assignment";

      case "EXAM":
        return "Exam";

      case "LEAVE_APPROVED":
        return "Leave Approved";

      case "LEAVE_REJECTED":
        return "Leave Rejected";

      default:
        return "Notification";
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    if (days === 1) return "Yesterday";

    return `${days} days ago`;
  };

  const todayCount = notifications.filter(
    (notification) =>
      new Date(notification.date).toDateString() === new Date().toDateString(),
  ).length;

  const weekCount = notifications.filter((notification) => {
    const diff =
      (Date.now() - new Date(notification.date).getTime()) /
      (1000 * 60 * 60 * 24);

    return diff >= 0 && diff <= 7;
  }).length;

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* HEADER */}

      <div className="px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft size={18} className="text-[#4B517D]" />
          </button>

          <div>
            <h1 className="text-[21px] font-bold text-[#30354D]">
              Notifications
            </h1>

            <p className="text-xs text-slate-400 mt-1">Recent activities</p>
          </div>
        </div>
      </div>

      {/* STATISTICS */}

      <div className="px-4 mt-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#EEF2FF] rounded-[18px] p-3.5">
            <p className="text-[10px] text-slate-500">Total</p>

            <h2 className="text-2xl font-bold text-[#4B517D] mt-1">
              {notifications.length}
            </h2>
          </div>

          <div className="bg-[#EAF8EF] rounded-[18px] p-3.5">
            <p className="text-[10px] text-slate-500">Today</p>

            <h2 className="text-2xl font-bold text-[#159447] mt-1">
              {todayCount}
            </h2>
          </div>

          <div className="bg-[#FFF5E9] rounded-[18px] p-3.5">
            <p className="text-[10px] text-slate-500">This Week</p>

            <h2 className="text-2xl font-bold text-[#E85D04] mt-1">
              {weekCount}
            </h2>
          </div>
        </div>
      </div>

      {/* NOTIFICATION LIST */}

      <div className="px-4 mt-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-[24px] p-4 border border-slate-100 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />

                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded-lg w-2/3" />

                    <div className="h-3 bg-slate-100 rounded-lg w-full mt-3" />

                    <div className="h-3 bg-slate-100 rounded-lg w-1/2 mt-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 text-center border border-slate-100 shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
              <Bell size={28} className="text-[#C8D0E3]" />
            </div>

            <p className="mt-4 text-sm font-semibold text-[#4B517D]">
              No notifications available
            </p>

            <p className="mt-1 text-xs text-slate-400">
              You&apos;re all caught up.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => {
              const isRecent =
                (Date.now() - new Date(item.date).getTime()) /
                  (1000 * 60 * 60) <
                24;

              return (
                <button
                  key={item.id}
                  onClick={() => openNotification(item)}
                  className="
                    w-full
                    bg-white
                    rounded-[24px]
                    p-4
                    border
                    border-slate-100
                    shadow-sm
                    text-left
                    transition-all
                    duration-200
                    active:scale-[0.98]
                    hover:shadow-md
                  "
                >
                  <div className="flex gap-3">
                    {/* ICON */}

                    <div
                      className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        shrink-0
                        ${getIconBg(item.type)}
                      `}
                    >
                      {getIcon(item.type)}
                    </div>

                    {/* CONTENT */}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="font-semibold text-[15px] text-[#30354D] truncate">
                            {item.title}
                          </h3>

                          {isRecent && (
                            <span className="w-2 h-2 rounded-full bg-[#F59A23] shrink-0" />
                          )}
                        </div>

                        <span
                          className={`
                            px-2.5
                            py-1
                            rounded-full
                            text-[10px]
                            font-semibold
                            whitespace-nowrap
                            ${getBadge(item.type)}
                          `}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-4">
                        {item.message}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-3 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 truncate">
                          <span>🏫</span>
                          <span className="truncate">{item.className}</span>
                        </span>

                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <span>🕒</span>
                          {timeAgo(item.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
