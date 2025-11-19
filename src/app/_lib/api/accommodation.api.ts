import apiInstance from '../intance';

// 숙소 등록
export const createAccommodation = async (data: {
  business_verification_id: string;
  name: string;
  address: string;
  detailed_address?: string;
  access_method?: string;
  accommodation_type: 'ETC' | 'APARTMENT' | 'VILLA' | 'STUDIO' | 'HOUSE';
  area_pyeong?: number;
  room_count?: number;
  bed_count?: number;
  living_room_count?: number;
  bathroom_count?: number;
  max_occupancy?: number;
  supply_storage_location?: string;
  trash_location?: string;
  recycle_location?: string;
  cleaning_notes?: string;
  latitude?: number;
  longitude?: number;
  photo_urls?: string[];
}) => {
  const response = await apiInstance.post('/api/v1/accommodations', data);
  return response.data;
};
