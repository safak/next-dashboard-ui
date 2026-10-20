"use client";

import { Bell } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import NotificationDropdown, { Notification } from "./NotificationDropdown";

type Role = "admin" | "teacher" | "student" | "parent";

interface NotificationBellProps {
  role: Role;
}

export default function NotificationBell({ role }: NotificationBellProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const hiddenNotificationIdsRef = useRef<Set<string>>(new Set());

  const sessionExpiredRef = useRef(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";

  const loadNotifications = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setNotifications([]);
      setUnread(0);
      setOpen(false);
      return;
    }

    if (!isAdmin && !isTeacher) {
      setNotifications([]);
      setUnread(0);
      return;
    }

    if (sessionExpiredRef.current) {
      return;
    }

    try {
      const endpoint = isTeacher
        ? "/api/mobile/teacher/notifications"
        : "/api/admin/notifications";

      const response = await fetch(endpoint, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      if (response.status === 401) {
        sessionExpiredRef.current = true;

        setNotifications([]);
        setUnread(0);
        setOpen(false);

        return;
      }

      if (response.status === 403) {
        setNotifications([]);
        setUnread(0);
        setOpen(false);

        return;
      }

      if (!response.ok) {
        console.warn(
          `Notification API returned ${response.status} (${endpoint})`,
        );

        return;
      }

      const data = await response.json();

      if (isTeacher) {
        const teacherNotifications = Array.isArray(data)
          ? data
          : (data.notifications ?? []);

        const mappedNotifications: Notification[] = teacherNotifications
          .map((item: any) => ({
            id: String(item.id),
            title: item.title,
            message: item.message,
            type: item.type,
            referenceId: item.refId ?? item.referenceId ?? null,
            createdAt: item.date ?? item.createdAt,
            isRead: item.isRead ?? false,
          }))
          .filter(
            (item: Notification) =>
              !item.isRead &&
              !hiddenNotificationIdsRef.current.has(String(item.id)),
          );

        setNotifications(mappedNotifications);
        setUnread(mappedNotifications.length);

        return;
      }

      const adminNotifications: Notification[] = (
        data.notifications ?? []
      ).filter(
        (item: Notification) =>
          !item.isRead &&
          !hiddenNotificationIdsRef.current.has(String(item.id)),
      );

      setNotifications(adminNotifications);
      setUnread(adminNotifications.length);
    } catch (error) {
      console.warn("Notification request could not be completed.", error);
    }
  }, [isAdmin, isTeacher, isLoaded, isSignedIn]);

  const openNotification = async (notification: Notification) => {
    try {
      if (isAdmin) {
        await reviewAdminNotification(notification);
        return;
      }

      if (isTeacher) {
        await openTeacherNotification(notification);
      }
    } catch (error) {
      console.error("Failed to open notification:", error);
    }
  };

  const reviewAdminNotification = async (notification: Notification) => {
    const notificationId = String(notification.id);

    hiddenNotificationIdsRef.current.add(notificationId);

    setNotifications((current) =>
      current.filter((item) => String(item.id) !== notificationId),
    );

    setUnread((current) => Math.max(0, current - 1));

    setOpen(false);

    try {
      const response = await fetch(
        `/api/admin/notifications/${encodeURIComponent(notificationId)}/read`,
        {
          method: "PATCH",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (response.status === 401) {
        sessionExpiredRef.current = true;

        setNotifications([]);
        setUnread(0);

        return;
      }

      if (!response.ok) {
        hiddenNotificationIdsRef.current.delete(notificationId);

        await loadNotifications();

        return;
      }

      if (
        notification.type === "TEACHER_LEAVE" ||
        notification.type === "LEAVE_APPROVED" ||
        notification.type === "LEAVE_REJECTED"
      ) {
        router.push(
          `/admin/teacher-leaves?leaveId=${notification.referenceId}`,
        );

        return;
      }

      if (notification.referenceId) {
        router.push(`/admin/notifications/${notification.referenceId}`);
      }
    } catch (error) {
      hiddenNotificationIdsRef.current.delete(notificationId);

      await loadNotifications();

      console.error("Failed to review admin notification:", error);
    }
  };

  const openTeacherNotification = async (notification: Notification) => {
    const notificationId = String(notification.id);

    const isLeaveNotification =
      notification.type === "LEAVE_APPROVED" ||
      notification.type === "LEAVE_REJECTED";

    hiddenNotificationIdsRef.current.add(notificationId);

    setNotifications((current) =>
      current.filter((item) => String(item.id) !== notificationId),
    );

    setUnread((current) => Math.max(0, current - 1));

    setOpen(false);

    try {
      const response = await fetch(
        `/api/mobile/teacher/notifications/${encodeURIComponent(
          notificationId,
        )}/read`,
        {
          method: "PATCH",
          credentials: "include",
          cache: "no-store",
        },
      );

      if (response.status === 401) {
        sessionExpiredRef.current = true;

        setNotifications([]);
        setUnread(0);

        return;
      }

      if (!response.ok) {
        hiddenNotificationIdsRef.current.delete(notificationId);

        await loadNotifications();

        const result = await response.json().catch(() => null);

        console.error(
          "Failed to mark notification as read:",
          result ?? {
            status: response.status,
          },
        );
      }
    } catch (error) {
      hiddenNotificationIdsRef.current.delete(notificationId);

      await loadNotifications();

      console.error("Failed to mark notification as read:", error);
    }

    if (isLeaveNotification) {
      router.push("/teacher/mobile/my-attendance");

      router.refresh();

      return;
    }

    router.push("/teacher/mobile/notifications");

    router.refresh();
  };

  const markAllAsRead = async () => {
    const currentIds = notifications.map((item) => String(item.id));

    currentIds.forEach((id) => {
      hiddenNotificationIdsRef.current.add(id);
    });

    setNotifications([]);
    setUnread(0);
    setOpen(false);

    try {
      let response: Response;

      if (isAdmin) {
        response = await fetch("/api/admin/notifications/read-all", {
          method: "PATCH",
          credentials: "include",
          cache: "no-store",
        });
      } else if (isTeacher) {
        response = await fetch("/api/mobile/teacher/notifications/read-all", {
          method: "PATCH",
          credentials: "include",
          cache: "no-store",
        });
      } else {
        return;
      }

      if (response.status === 401) {
        sessionExpiredRef.current = true;

        setNotifications([]);
        setUnread(0);

        return;
      }

      if (!response.ok) {
        currentIds.forEach((id) => hiddenNotificationIdsRef.current.delete(id));

        await loadNotifications();
      }
    } catch (error) {
      currentIds.forEach((id) => hiddenNotificationIdsRef.current.delete(id));

      await loadNotifications();

      console.error("Failed to mark notifications as read:", error);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      sessionExpiredRef.current = false;
      hiddenNotificationIdsRef.current.clear();

      setNotifications([]);
      setUnread(0);
      setOpen(false);

      return;
    }

    sessionExpiredRef.current = false;
    hiddenNotificationIdsRef.current.clear();

    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoaded, isSignedIn, role, loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Notifications"
        aria-expanded={open}
        className="
          relative
          flex
          h-[34px]
          w-[34px]
          items-center
          justify-center
          rounded-full
          bg-[#FFF8EC]
          shadow-sm
          transition-all
          duration-200
          hover:bg-white
          hover:ring-2
          hover:ring-[#FF9100]/40
          active:scale-95
          sm:h-10
          sm:w-10
        "
      >
        <Bell
          className={`
            h-[16px]
            w-[16px]
            transition-colors
            duration-200
            sm:h-[18px]
            sm:w-[18px]
            ${open ? "text-[#FF9100]" : "text-[#464B71]"}
          `}
          strokeWidth={2}
        />

        {unread > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-[16px]
              min-w-[16px]
              items-center
              justify-center
              rounded-full
              bg-[#FF9100]
              px-0.5
              text-[8px]
              font-bold
              text-white
              shadow-sm
              ring-2
              ring-[#464B71]
              sm:h-5
              sm:min-w-[20px]
              sm:px-1
              sm:text-[9px]
            "
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      <NotificationDropdown
        open={open}
        notifications={notifications}
        onReview={openNotification}
        onMarkAllAsRead={markAllAsRead}
        onViewAll={() => {
          setOpen(false);

          if (role === "teacher") {
            router.push("/teacher/mobile/notifications");

            return;
          }

          if (role === "admin") {
            router.push("/admin/notifications");
          }
        }}
      />
    </div>
  );
}
