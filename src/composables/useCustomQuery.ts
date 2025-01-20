import { useQuery, UseQueryOptions, QueryKey, QueryFunction } from '@tanstack/vue-query';

const defaultQueryOptions = {
  refetchOnMount: false, // refetchOnMount: 컴포넌트가 마운트될 때 자동으로 다시 fetch하지 않음
  refetchOnWindowFocus: false, // refetchOnWindowFocus: 윈도우가 포커스될 때 자동으로 다시 fetch하지 않음
};

export function useCustomQuery<T>(
  key: QueryKey, // key: 쿼리를 식별하는 고유 키
  queryFn: QueryFunction<T>, // queryFn: 실제 데이터를 가져오는 비동기 함수
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  // @tanstack/vue-query의 useQuery 훅을 사용하여 쿼리 실행
  return useQuery<T>({
    queryKey: key,
    queryFn,
    ...defaultQueryOptions,
    ...options,
  });
}
