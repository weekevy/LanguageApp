import type { ApiFailure, ApiSuccess } from "@linguatube/shared";

export const successResponse = <T>(data: T): ApiSuccess<T> => ({
  success: true,
  data,
  error: null,
});

export const errorResponse = (
  code: string,
  message: string,
  details?: unknown,
): ApiFailure => {
  const error = details === undefined ? { code, message } : { code, message, details };

  return {
    success: false,
    data: null,
    error,
  };
};
