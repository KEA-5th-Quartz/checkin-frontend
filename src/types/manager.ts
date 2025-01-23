// 개수 필터링
export interface PageOption {
  id: number;
  value: number | string;
  label: string;
}

// 대시보드 테이블 데이터
export interface TableData {
  id: number;
  title: string;
  category1: string;
  category2: string;
  description: string;
  status: '생성' | '진행중' | '완료';
  assignee: string;
  dueDate: string;
  priority?: '긴급' | '높음' | '보통' | '낮음';
}
