import { useQuery, UseQueryOptions, QueryKey, QueryFunction } from '@tanstack/vue-query';

const defaultQueryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

export function useCustomQuery<T>(
  key: QueryKey,
  queryFn: QueryFunction<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T>({
    queryKey: key,
    queryFn,
    ...defaultQueryOptions,
    ...options,
  });
}
