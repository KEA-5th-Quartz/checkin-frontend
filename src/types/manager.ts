export interface PageOption {
  id: number;
  value: number | string;
  label: string;
}

export interface TableData {
  id: number;
  title: string;
  category1: string;
  category2: string;
  description: string;
  status: string;
  assignee: string;
  dueDate: string;
  priority?: '긴급' | '높음' | '보통' | '낮음';
}

export interface ManagerFilterState {
  statuses: string[];
  usernames: string[];
  categories: string[];
  dueToday: boolean;
  dueThisWeek: boolean;
}

export interface ManagerFilterPayload {
  quickFilters: string[];
  managers: string[];
  statuses: string[];
  categories: string[];
}
