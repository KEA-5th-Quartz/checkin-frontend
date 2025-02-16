export interface ApiErrorData {
  blockTime?: string;
  [key: string]: unknown;
}

export interface ApiError {
  status: number;
  code: string;
  message: string;
  data?: ApiErrorData;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'code' in error &&
    'message' in error &&
    typeof (error as ApiError).status === 'number' &&
    typeof (error as ApiError).code === 'string' &&
    typeof (error as ApiError).message === 'string'
  );
}

export interface ErrorTableProps {
  message?: string;
  error?: unknown;
}
