export interface Option {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface Design {
  id: number;
  number: number;
  name: string;
  status: string;
  designer?: string;
  partner?: string;
  date: string;
}

export type IconName =
  | 'home'
  | 'employee'
  | 'designs'
  | 'newDesign'
  | 'notes'
  | 'calendar'
  | 'compare'
  | 'profile'
  | 'settings'
  | 'logout'
  | 'filter'
  | 'sort'
  | 'delete'
  | 'details';

export type StatusIconName = 'new' | 'waiting' | 'notSend' | 'send' | 'done';

export type IconCategory = 'status';

export type CustomIconName = IconName | { category: IconCategory; icon: StatusIconName };

export interface MenuItem {
  icon: IconName;
  label: string;
  href: string;
  visible: string[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  className?: string;
}
