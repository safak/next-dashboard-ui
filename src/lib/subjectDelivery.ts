import type { DeliveryMode, LessonFormat } from "@prisma/client";

// Kept free of server-only imports so client forms can use it too

export const DELIVERY_MODES: DeliveryMode[] = ["PHYSICAL", "ONLINE", "BOTH"];

export const deliveryLabels: Record<DeliveryMode, string> = {
  PHYSICAL: "In person",
  ONLINE: "Online",
  BOTH: "Online & in person",
};

export const deliveryStyles: Record<DeliveryMode, string> = {
  PHYSICAL: "bg-amber-100 text-amber-800",
  ONLINE: "bg-sky-100 text-sky-800",
  BOTH: "bg-green-100 text-green-800",
};

export const LESSON_FORMATS: LessonFormat[] = [
  "ONE_ON_ONE",
  "GROUP",
  "HOUSE_CALL",
  "ONLINE",
];

export const formatLabels: Record<LessonFormat, string> = {
  ONE_ON_ONE: "One-on-one",
  GROUP: "Group",
  HOUSE_CALL: "House call",
  ONLINE: "Online",
};

// Online lessons need an online subject; the rest happen in person
export const formatsFor = (delivery: DeliveryMode): LessonFormat[] =>
  delivery === "ONLINE"
    ? ["ONLINE"]
    : delivery === "PHYSICAL"
    ? ["ONE_ON_ONE", "GROUP", "HOUSE_CALL"]
    : LESSON_FORMATS;
