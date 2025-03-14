export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}

export interface PriorityBadgeProps {
  priority?: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
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

export type StatusType = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
