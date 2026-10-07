export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Contract {
  id?: number;
  propertyId: number;
  tenantId: number;
  startDate: Date | string;
  endDate: Date | string;
  monthlyAmount: number;
  depositAmount: number;
  status: ContractStatus;
  createdAt?: Date;
  updatedAt?: Date;
}