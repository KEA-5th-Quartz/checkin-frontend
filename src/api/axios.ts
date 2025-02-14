import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AxiosError } from 'axios';
import { useMemberStore } from '@/stores/memberStore';
import { useRouter } from 'vue-router';

const BASE_URL = process.env.VUE_APP_BASE_URL;
const router = useRouter();

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const memberStore = useMemberStore();
  if (memberStore.accessToken) {
    config.headers.Authorization = `Bearer ${memberStore.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest?.url?.includes('/auth/refresh')) {
      const memberStore = useMemberStore();
      memberStore.clearMemberInfo();
      router.push('/');
      return Promise.reject(error);
    }

    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      message: '서버와의 통신에 실패했습니다.',
      status: 500,
    });
  },
);
export default api;
