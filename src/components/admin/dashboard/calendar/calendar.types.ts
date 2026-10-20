// src/components/admin/dashboard/calendar/calendar.types.ts

export interface CalendarHoliday {
  id?: number;
  title: string;
  date: Date;
  isFullDay?: boolean;
}

export interface CalendarEvent {
  id: number;
  title: string;
  startTime: Date;
  endTime?: Date;
  description?: string;
  color?: string;
}

export interface CalendarDayData {
  date: Date;
  isToday: boolean;
  isSunday: boolean;
  isSecondSaturday: boolean;
  holiday?: CalendarHoliday;
  events?: CalendarEvent[];
}

export interface UpcomingHoliday {
  title: string;
  date: Date;
  isFullDay?: boolean;
}

export interface CalendarGridProps {
  selectedDate: Date;
  activeStartDate: Date;
  holidays: Record<string, CalendarHoliday>;
  events?: Record<string, CalendarEvent[]>;
  expanded: boolean;
  onDateChange: (date: Date) => void;
  onActiveStartDateChange: (date: Date) => void;
}

export interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export interface CalendarLegendProps {}

export interface CalendarDayTileProps {
  date: Date;
  holiday?: CalendarHoliday;
  events?: CalendarEvent[];
}

export interface TodayScheduleProps {
  events: CalendarEvent[];
}

export interface UpcomingHolidaysProps {
  holidays: UpcomingHoliday[];
}
