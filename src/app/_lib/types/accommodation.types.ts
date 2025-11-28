// Accommodation 관련 타입 정의

export type AccommodationType = 'ETC' | 'APARTMENT' | 'VILLA' | 'STUDIO' | 'HOUSE';

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
