import { dbPool } from '../config/database.js';
import { Payment, PaymentStatus } from '../models/Payment.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class PaymentService {
  public async getAllPayments(): Promise<Payment[]> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT id, contractId, amount, dueDate, paidDate, status, notes, createdAt FROM payments'
    );
    return rows as Payment[];
  }

  public async getPaymentsByContract(contractId: number): Promise<Payment[]> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      'SELECT id, contractId, amount, dueDate, paidDate, status, notes, createdAt FROM payments WHERE contractId = ?',
      [contractId]
    );
    return rows as Payment[];
  }

  public async registerPayment(payment: Payment): Promise<Payment> {
    const paidDate = payment.paidDate || new Date();
    const status = payment.status || PaymentStatus.PAID;

    const [result] = await dbPool.query<ResultSetHeader>(
      'INSERT INTO payments (contractId, amount, dueDate, paidDate, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [
        payment.contractId,
        payment.amount,
        payment.dueDate,
        paidDate,
        status,
        payment.notes || null,
      ]
    );

    return {
      id: result.insertId,
      ...payment,
      paidDate,
      status,
    };
  }

  public async getFinancialSummary(): Promise<any> {
    const [totalCollected] = await dbPool.query<RowDataPacket[]>(
      "SELECT SUM(amount) as total FROM payments WHERE status = 'PAID'"
    );

    const [pendingAmount] = await dbPool.query<RowDataPacket[]>(
      "SELECT SUM(amount) as total FROM payments WHERE status = 'PENDING'"
    );

    const [latePayments] = await dbPool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM payments WHERE status = 'LATE'"
    );

    return {
      totalCollected: totalCollected[0].total || 0,
      pendingAmount: pendingAmount[0].total || 0,
      latePaymentsCount: latePayments[0].count || 0,
    };
  }

  public async updatePayment(id:number,payment:Partial<Payment>):Promise<boolean>{
    const [result]=await dbPool.query<ResultSetHeader>('UPDATE payments SET amount=COALESCE(?,amount), dueDate=COALESCE(?,dueDate), paidDate=?, status=COALESCE(?,status), notes=? WHERE id=?',[payment.amount??null,payment.dueDate??null,payment.paidDate??null,payment.status??null,payment.notes??null,id]);
    return result.affectedRows>0;
  }
  public async deletePayment(id:number):Promise<boolean>{const [result]=await dbPool.query<ResultSetHeader>('DELETE FROM payments WHERE id=?',[id]);return result.affectedRows>0;}
}