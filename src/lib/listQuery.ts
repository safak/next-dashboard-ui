// Helpers for the ?sort= param used by ListControls on the list pages

export type SortMap<OrderBy> = Record<string, { label: string; orderBy: OrderBy }>;

export const sortOptions = <O,>(map: SortMap<O>) =>
  Object.entries(map).map(([value, { label }]) => ({ value, label }));

export const resolveOrderBy = <O,>(map: SortMap<O>, sort?: string) =>
  sort && map[sort] ? map[sort].orderBy : undefined;

export const toOptions = <T extends { id: number | string }>(
  rows: T[],
  label: (row: T) => string
) => rows.map((row) => ({ value: row.id, label: label(row) }));
