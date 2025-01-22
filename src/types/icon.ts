export interface IconOptions {
  stroke?: string;
  strokeWidth?: number;
  strokeLinecap?: 'round' | 'butt' | 'square';
  strokeLinejoin?: 'round' | 'bevel' | 'miter';
  fillRule?: 'nonzero' | 'evenodd';
  clipRule?: 'nonzero' | 'evenodd';
}

export interface IconPathTypes {
  path: string | string[];
  fill: string;
  width: number;
  height: number;
  options?: IconOptions;
}

export interface IconProps {
  icon: {
    path: string | string[];
    fill: string;
    width: number;
    height: number;
    options?: {
      stroke?: string;
      strokeWidth?: number | string;
      strokeLinecap?: 'round' | 'butt' | 'square';
      strokeLinejoin?: 'round' | 'bevel' | 'miter';
      fillRule?: 'nonzero' | 'evenodd';
      clipRule?: 'nonzero' | 'evenodd';
    };
  };
  className?: string;
}
