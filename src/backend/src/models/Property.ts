export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  WAREHOUSE = 'WAREHOUSE',
  COMMERCIAL = 'COMMERCIAL'
}

export interface Property {
  id?: number;
  landlordId: number;
  title: string;
  description?: string;
  address: string;
  city: string;
  countryCode: string;
  countryName: string;
  propertyType: PropertyType;
  monthlyRent: number;
  currencyCode: string;
  latitude: number;
  longitude: number;
  status: PropertyStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
