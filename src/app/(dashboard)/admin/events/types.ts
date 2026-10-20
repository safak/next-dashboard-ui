import type {
  EventFormInput as SchemaEventFormInput,
  EventFormValues,
} from "./schema";

export type EventRow = {
  id: number;

  title: string;

  description: string;

  startTime: Date;

  endTime: Date;

  classId: number | null;

  category: string | null;

  class: {
    id: number;
    name: string;
  } | null;
};

export type ClassOption = {
  id: number;
  name: string;
};

export type EventSortOption =
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc"
  | "category-asc"
  | "category-desc";

export type EventFormInput = SchemaEventFormInput;

export type EventFormData = EventFormValues;

export type ActionState = {
  success: boolean;
  error?: string;
};
