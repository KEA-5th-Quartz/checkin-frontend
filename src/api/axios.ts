import axios from 'axios';
import { AxiosError } from 'axios';
import { useMemberStore } from '@/stores/memberStore';
import { userApi } from '@/services/userService/userService';
import { useRouter } from 'vue-router';

const BASE_URL = process.env.VUE_APP_BASE_URL;
const router = useRouter();

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

    // refresh 토큰으로 새로운 토큰을 요청하는 API 자체가 401 에러를 반환하면,
    // // 더 이상의 refresh 시도 없이 바로 로그아웃 처리
    if (error.response?.status === 401 && originalRequest?.url?.includes('/auth/refresh')) {
      const memberStore = useMemberStore();
      memberStore.clearMemberInfo();
      router.push('/');
      return Promise.reject(error);
    }

    // 로그인 요청(/auth/login)에서 발생하는 401 에러는 토큰 갱신 로직을 타지 않도록 제외
    if (error.response?.status === 401 && originalRequest && !originalRequest.url?.includes('/auth/login')) {
      // isRefreshing 플래그로 동시에 여러 refresh 요청이 발생하는 것을 방지
      // 대기중인 요청들은 failedQueue에 저장했다가 나중에 한 번에 처리
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject }); // 중복 refresh 방지
        });
      }

      isRefreshing = true;

      try {
        const response = await userApi.refresh();
        const newAccessToken = response.data.data.accessToken;

        const memberStore = useMemberStore();
        memberStore.setMemberInfo(response.data.data);

        isRefreshing = false;
        processQueue();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);

        const memberStore = useMemberStore();
        memberStore.clearMemberInfo();
        router.push('/');

        return Promise.reject(refreshError);
      }
    }

    // 그 외 에러 처리
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    // 네트워크 에러 처리
    return Promise.reject({
      message: '서버와의 통신에 실패했습니다.',
      status: 500,
    });
  },
);
export default api;
