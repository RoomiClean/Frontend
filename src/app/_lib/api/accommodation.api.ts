import apiInstance from '../instance';
import type { CreateAccommodationRequest } from '../types/accommodation.types';
import type { ApiResponse } from '../api-response.types';

// 숙소 등록
export const createAccommodation = async (
  data: CreateAccommodationRequest,
): Promise<ApiResponse> => {
  const response = await apiInstance.post('/api/v1/accommodations', data);
  return response.data;
};
