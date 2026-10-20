export const ITEM_PER_PAGE = 5
export type Role = "admin" | "teacher" | "student" | "parent";

export type RouteAccessMap = Record<string, Role[]>;

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/student(.*)": ["student"],
  "/teacher(.*)": ["teacher"],
  "/parent(.*)": ["parent"],
};