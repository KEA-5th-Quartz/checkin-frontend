export interface User {
  id: number;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}


// 템블릿 목록 데이터
export interface TemplateData {
  id: number;
  title: string;
  category1: string;
  category2: string;
  description: string;
  dueDate: string;
}
