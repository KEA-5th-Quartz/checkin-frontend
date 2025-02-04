import axios from 'axios';
import { AxiosError } from 'axios';
import { useMemberStore } from '@/stores/memberStore';

const BASE_URL = process.env.VUE_APP_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 모든 요청에 쿠키 포함
});

// 토큰 갱신 중인지 체크하는 플래그
let isRefreshing = false;
// 갱신 중에 실패한 요청들을 저장하는 배열
let failedQueue: any[] = [];

// 실패한 요청들 재시도
const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request 인터셉터
api.interceptors.request.use((config) => {
  const memberStore = useMemberStore();
  if (memberStore.accessToken) {
    config.headers.Authorization = `Bearer ${memberStore.accessToken}`;
    console.log('🚀 API 요청 Authorization 헤더:', config.headers.Authorization);
  } else {
    console.error('❌ accessToken이 존재하지 않습니다!');
  }
  return config;
});

// Response 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 401 에러 처리 (토큰 관련)
    if (error.response?.status === 401 && originalRequest) {
      // 로그인 엔드포인트에서의 401 에러는 바로 반환
      if (originalRequest.url === '/auth/login') {
        return Promise.reject(error.response.data);
      }

      // 토큰 갱신 로직
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      isRefreshing = true;

      try {
        const response = await api.post(
          '/auth/refresh',
          {},
          {
            withCredentials: true,
          },
        );

        const memberStore = useMemberStore();
        memberStore.setMemberInfo(response.data.data);

        isRefreshing = false;
        processQueue();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${memberStore.accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        return Promise.reject(refreshError);
      }
    }

    // 다른 에러들의 처리
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    // 네트워크 에러 등의 경우
    return Promise.reject({
      message: '서버와의 통신에 실패했습니다.',
      status: 500,
    });
  },
);

export default api;
