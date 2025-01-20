import axios from 'axios';
// import { AxiosError } from 'axios'; 인터셉터 작성과 함께 사용

const api = axios.create({
  baseURL: 'testurl',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터, 헤더에 토큰 추가 로직 작성
api.interceptors.request.use();

// Response 인터셉터
api.interceptors.response.use();

export default api;
