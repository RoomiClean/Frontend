import apiInstance from '../instance';
import type {
  CreateAccommodationRequest,
  AccommodationListResponse,
} from '../types/accommodation.types';
import type { ApiResponse } from '../api-response.types';

// 숙소 등록
export const createAccommodation = async (
  data: CreateAccommodationRequest,
): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/accommodations', data);
  return response.data;
};

// 내 숙소 목록 조회
export const getAccommodations = async (): Promise<ApiResponse<AccommodationListResponse>> => {
  const response = await apiInstance.get('/api/v1/accommodations');
  return response.data;
};
