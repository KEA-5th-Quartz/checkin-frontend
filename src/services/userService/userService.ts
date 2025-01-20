import api from '@/api/axios';
import type { User, LoginRequest, LoginResponse } from '@/types/user';

// 임시 유저 CRUD
export const userApi = {
  // 로그인
  login(data: LoginRequest) {
    return api.post<LoginResponse>('/auth/login', data);
  },

  // 사용자 목록 조회
  getUsers() {
    return api.get<User[]>('/users');
  },

  // 특정 사용자 조회
  getUser(id: number) {
    return api.get<User>(`/users/${id}`);
  },

  // 사용자 정보 수정
  updateUser(id: number, data: Partial<User>) {
    return api.put<User>(`/users/${id}`, data);
  },

  // 사용자 삭제
  deleteUser(id: number) {
    return api.delete(`/users/${id}`);
  },
};
