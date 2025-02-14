export interface TemplateData {
  id: number;
  title: string;
  category1: string;
  category2: string;
  description: string;
  dueDate: string;
}

export interface UserFilterState {
  statuses: string[];
  categories: string[];
}

export interface UserFilterPayload {
  statuses: string[];
  categories: string[];
}
