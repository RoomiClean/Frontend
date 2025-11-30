export type AccommodationType = 'ETC' | 'APARTMENT' | 'VILLA' | 'STUDIO' | 'HOUSE';

/**
 * 숙소 등록 요청 타입
 */
export interface CreateAccommodationRequest {
  businessVerificationId: string;
  name: string;
  address: string;
  detailedAddress?: string;
  accessMethod?: string;
  accommodationType: AccommodationType;
  areaPyeong?: number;
  roomCount?: number;
  bedCount?: number;
  livingRoomCount?: number;
  bathroomCount?: number;
  maxOccupancy?: number;
  supplyStorageLocation?: string;
  trashLocation?: string;
  recycleLocation?: string;
  cleaningNotes?: string;
  latitude?: number;
  longitude?: number;
  photoUrls?: string[];
}

/**
 * 숙소 사진 타입
 */
export interface AccommodationPhoto {
  id: string;
  photoUrl: string;
  displayOrder: number;
}

/**
 * 숙소 목록 조회 응답 타입
 */
export interface AccommodationListItem {
  id: string;
  name: string;
  address: string;
  detailedAddress?: string | null;
  photos: AccommodationPhoto[];
  nextCheckin: string | null;
  nextCheckout: string | null;
}

/**
 * 숙소 통계 타입
 */
export interface AccommodationStatistics {
  totalCount: number;
  cleaningNeededCount: number;
  todayCleaningScheduledCount: number;
}

/**
 * 숙소 목록 조회 응답 타입
 */
export interface AccommodationListResponse {
  statistics: AccommodationStatistics;
  accommodations: AccommodationListItem[];
}
