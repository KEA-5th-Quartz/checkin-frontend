import { useMutation, MutationFunction } from '@tanstack/vue-query';
// import type { MaybeRef } from 'vue';

export interface APIError {
  message: string;
  statusCode: number;
  response?: unknown;
}

export function useCustomMutation<TData = unknown, TError = APIError, TVariables = void, TContext = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
    onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
  },
) {
  return useMutation(mutationFn, {
    retry: 1,
    ...options,
  });
}
