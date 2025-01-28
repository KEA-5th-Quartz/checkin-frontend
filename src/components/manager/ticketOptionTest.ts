import { BaseTicketOption, StatusTicketOption } from '@/types/tickets';

export const priority: StatusTicketOption[] = [
  { id: 1, value: '긴급', label: '긴급', bg: 'bg-red-0', text: 'text-red-1' },
  { id: 2, value: '높음', label: '높음', bg: 'bg-orange-0', text: 'text-orange-1' },
  { id: 3, value: '보통', label: '보통', bg: 'bg-green-0', text: 'text-green-1' },
  { id: 4, value: '낮음', label: '낮음', bg: 'bg-blue-4', text: 'text-blue-2' },
];

export const status: StatusTicketOption[] = [
  { id: 1, value: 'OPEN', label: 'OPEN', bg: 'bg-gray-4', text: 'text-gray-0' },
  { id: 2, value: 'IN_PROGRESS', label: 'IN_PROGRESS', bg: 'bg-blue-4', text: 'text-blue-2' },
  { id: 3, value: 'CLOSED', label: 'CLOSED', bg: 'bg-green-0', text: 'text-green-1' },
];

export const firstCategory: BaseTicketOption[] = [
  { id: 1, value: '카테고리 1', label: '카테고리 1' },
  { id: 2, value: '카테고리 2', label: '카테고리 2' },
  { id: 3, value: '카테고리 3', label: '카테고리 3' },
];

export const secondCategory: BaseTicketOption[] = [
  { id: 1, value: '생성', label: '생성' },
  { id: 2, value: '수정', label: '수정' },
  { id: 3, value: '삭제', label: '삭제' },
];

export const managerOptions: BaseTicketOption[] = [
  { id: 1, value: 'admin2.js', label: 'admin2.js' },
  { id: 2, value: 'admin3.js', label: 'admin3.js' },
  { id: 3, value: 'admin4.js', label: 'admin4.js' },
  { id: 4, value: 'manager1.js', label: 'manager1.js' },
  { id: 5, value: 'manager2.js', label: 'manager2.js' },
  { id: 6, value: 'manager3.js', label: 'manager3.js' },
];

export const perPageOptions = [
  { id: 1, value: 10, label: '10개' },
  { id: 2, value: 20, label: '20개' },
  { id: 3, value: 50, label: '50개' },
];
