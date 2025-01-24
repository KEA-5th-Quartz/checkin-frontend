import { BaseTicketOption, StatusTicketOption } from '@/types/tickets';

export const priority: StatusTicketOption[] = [
  { id: 1, value: '긴급', label: '긴급', bg: 'bg-red-0', text: 'text-red-1' },
  { id: 2, value: '높음', label: '높음', bg: 'bg-orange-0', text: 'text-orange-1' },
  { id: 3, value: '보통', label: '보통', bg: 'bg-green-0', text: 'text-green-1' },
  { id: 4, value: '낮음', label: '낮음', bg: 'bg-blue-4', text: 'text-blue-2' },
];

export const status: StatusTicketOption[] = [
  { id: 1, value: '생성', label: '생성', bg: 'bg-gray-4', text: 'text-gray-0' },
  { id: 2, value: '진행중', label: '진행중', bg: 'bg-blue-4', text: 'text-blue-2' },
  { id: 3, value: '완료', label: '완료', bg: 'bg-green-0', text: 'text-green-1' },
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
  { id: 1, value: '김철환', label: '김철환' },
  { id: 2, value: '김현중', label: '김현중' },
  { id: 3, value: '박가현', label: '박가현' },
  { id: 4, value: '박석종', label: '박석종' },
  { id: 5, value: '박준한', label: '박준한' },
  { id: 6, value: '손성민', label: '손성민' },
  { id: 7, value: '임찬호', label: '임찬호' },
  { id: 8, value: '조기헌', label: '조기헌' },
  { id: 9, value: '최현준', label: '최현준' },
];
