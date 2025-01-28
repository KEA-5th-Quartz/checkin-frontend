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
  }
  return config;
});

// Response 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      isRefreshing = true;

      try {
        // refresh 요청 시 withCredentials 옵션 추가
        const response = await api.post(
          '/auth/refresh',
          {},
          {
            withCredentials: true, // 쿠키 포함
          },
        );

        const memberStore = useMemberStore();
        memberStore.setMemberInfo(response.data.data);

        isRefreshing = false;
        processQueue();

        // 원래 요청 재시도
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
    return Promise.reject(error);
  },
);

export default api;
