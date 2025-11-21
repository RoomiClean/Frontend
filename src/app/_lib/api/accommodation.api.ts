import apiInstance from '../intance';
import type { CreateAccommodationRequest } from '../types/accommodation.types';

// 숙소 등록
export const createAccommodation = async (data: CreateAccommodationRequest) => {
  const response = await apiInstance.post('/api/v1/accommodations', data);
  return response.data;
};
