export interface StatusBadgeProps {
  status: '생성' | '진행중' | '완료';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}

export interface PriorityBadgeProps {
  priority?: '긴급' | '높음' | '보통' | '낮음';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  dotClass?: string;
  textClass?: string;
}

export interface LogStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}
