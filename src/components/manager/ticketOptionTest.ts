import { StatusTicketOption } from '@/types/tickets';

export const priority: StatusTicketOption[] = [
  { id: 1, value: 'EMERGENCY', label: '긴급', bg: 'bg-red-0 hover:ring-1 ring-inset ring-red-1', text: 'text-red-1' },
  {
    id: 2,
    value: 'HIGH',
    label: '높음',
    bg: 'bg-orange-0 hover:ring-1 ring-inset ring-orange-1',
    text: 'text-orange-1',
  },
  {
    id: 3,
    value: 'MEDIUM',
    label: '보통',
    bg: 'bg-green-0 hover:ring-1 ring-inset ring-green-1',
    text: 'text-green-1',
  },
  { id: 4, value: 'LOW', label: '낮음', bg: 'bg-blue-4 hover:ring-1 ring-inset ring-blue-1', text: 'text-blue-2' },
];

export const status: StatusTicketOption[] = [
  { id: 1, value: 'OPEN', label: 'OPEN', bg: 'bg-gray-4', text: 'text-gray-0' },
  { id: 2, value: 'IN_PROGRESS', label: 'IN_PROGRESS', bg: 'bg-blue-4', text: 'text-blue-2' },
  { id: 3, value: 'CLOSED', label: 'CLOSED', bg: 'bg-green-0', text: 'text-green-1' },
];

export const ticket_status: StatusTicketOption[] = [
  { id: 1, value: 'OPEN', label: '생성', bg: 'bg-gray-4 hover:ring-1 ring-inset ring-gray-0', text: 'text-gray-0' },
  {
    id: 2,
    value: 'IN_PROGRESS',
    label: '진행중',
    bg: 'bg-blue-4 hover:ring-1 ring-inset ring-blue-2',
    text: 'text-blue-2',
  },
  {
    id: 3,
    value: 'CLOSED',
    label: '완료',
    bg: 'bg-green-0 hover:ring-1 ring-inset ring-green-1',
    text: 'text-green-1',
  },
];

export const perPageOptions = [
  { id: 1, value: 20, label: '20개' },
  { id: 2, value: 50, label: '50개' },
  { id: 3, value: 100, label: '100개' },
];
