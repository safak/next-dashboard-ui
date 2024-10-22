import { UserRole } from "@prisma/client";
import { Row } from "@tanstack/react-table";

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface GenerateThumbnailProps {
  description?: string;
  image?: any;
}

export interface AppCardProps {
  image: string;
  name: string;
  packagename: string;
  classname: string;
  description: string;
  status: boolean;
  id: string;
}

export interface ContentCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  backdrop: string;
  isStatus: boolean;
}

export interface UsersProps {
  image: string;
  email: string;
  name: string;
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isStatus: boolean;
  id: string;
}

export interface TVChannelProps {
  tvName: string;
  tvIcon: any;
  tvmedia: string;
  tvNumber: string;
  isStatus: boolean;
  id: string;
}

export interface RowActionDetailProps<TData> {
  row: Row<TData>;
  title: string;
  description: string;
}

export interface RowActionsProps<TData> {
  row: Row<TData>;
}

export interface SliderCardProps {
  name: string;
  image: string;
  isStatus: boolean;
  id: string;
}

export interface ScreenCardProps {
  name: string;
  ipaddress: string;
  id: string;
}