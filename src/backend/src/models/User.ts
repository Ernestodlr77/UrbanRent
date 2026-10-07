export enum UserRole {
  ADMIN = 'ADMIN',
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT'
}

export interface User {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}