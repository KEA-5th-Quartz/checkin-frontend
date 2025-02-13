import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { useMemberStore } from '@/stores/memberStore';
import { userApi } from '@/services/userService/userService';
import { useRouter } from 'vue-router';
import { createApp } from 'vue';
import CommonDialog from '@/components/common/CommonDialog.vue';

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

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
let failedQueue: QueueItem[] = [];

// 실패한 요청들 재시도
const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const showErrorDialog = (title: string, content: string) => {
  const existingDialog = document.getElementById('error-dialog');
  if (existingDialog) {
    document.body.removeChild(existingDialog);
  }

  const dialogDiv = document.createElement('div');
  dialogDiv.id = 'error-dialog';
  document.body.appendChild(dialogDiv);

  const dialogApp = createApp(CommonDialog, {
    title,
    content,
    isWarn: true,
    isOneBtn: true,
    mainText: '확인',
    onMainClick: () => {
      document.body.removeChild(dialogDiv);
      dialogApp.unmount();
    },
  });

  dialogApp.mount(dialogDiv);
};

// Request 인터셉터
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const memberStore = useMemberStore();
  if (memberStore.accessToken) {
    config.headers.Authorization = `Bearer ${memberStore.accessToken}`;
  }
  return config;
});

// Response 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse) => response,
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
        processQueue();

        const memberStore = useMemberStore();
        memberStore.clearMemberInfo();
        router.push('/');

        return Promise.reject(refreshError);
      }
    }

    switch (error.response?.status) {
      case 401:
        showErrorDialog('인증 오류', '세션이 만료되었습니다.');
        break;
      case 403:
        showErrorDialog('접근 권한 없음', '해당 기능에 대한 접근 권한이 없습니다.');
        break;
      case 500:
        showErrorDialog('서버 오류', '서버에서 오류가 발생했습니다.');
        break;
      default:
    }

    return Promise.reject(error);
  },
);
export default api;
