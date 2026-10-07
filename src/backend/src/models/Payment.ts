export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  LATE = 'LATE'
}

export interface Payment {
  id?: number;
  contractId: number;
  amount: number;
  dueDate: Date | string;
  paidDate?: Date | string | null;
  status: PaymentStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}