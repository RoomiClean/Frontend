// 성공 응답
export interface ApiSuccessResponse<T = unknown> {
  status_code: number;
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

// 실패 응답
export interface ApiErrorResponse {
  status_code: number;
  success: false;
  message: string;
  timestamp: string;
  errors: Record<string, string>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
