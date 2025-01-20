import type { IconPathTypes } from '@/types/icon';

// 약관 체크 아이콘
export const TermCheckIcon: IconPathTypes = {
  path: 'm4.5 12.75 6 6 9-13.5',
  fill: 'none',
  width: 24,
  height: 24,
  options: {
    stroke: '#9FA6B2',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
};

// 눈 모양 아이콘
export const EyeIcon: IconPathTypes = {
  path: [
    'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z',
    'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  ],
  fill: 'none',
  width: 24,
  height: 24,
  options: {
    stroke: '#9FA6B2',
    strokeWidth: 1.5,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  },
};

// 눈 모양 짝대기 아이콘
export const EyeSlashIcon: IconPathTypes = {
  path: 'M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88',
  fill: 'none',
  width: 24,
  height: 24,
  options: {
    stroke: '#9FA6B2',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
};
