import { dbPool } from '../config/database.js';
import { Contract, ContractStatus } from '../models/Contract.js';
import { PropertyStatus } from '../models/Property.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ContractService {
  public async getAllContracts(): Promise<Contract[]> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      `SELECT c.id, c.propertyId, c.tenantId, u.fullName AS tenantName,
              c.startDate, c.endDate, c.monthlyAmount, c.depositAmount, c.status, c.createdAt
       FROM contracts c JOIN users u ON u.id = c.tenantId`
    );
    return rows as Contract[];
  }

  public async getContractById(id: number): Promise<Contract | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      `SELECT c.id, c.propertyId, c.tenantId, u.fullName AS tenantName,
              c.startDate, c.endDate, c.monthlyAmount, c.depositAmount, c.status, c.createdAt
       FROM contracts c JOIN users u ON u.id = c.tenantId WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) return null;
    return rows[0] as Contract;
  }

  public async createContract(contract: Contract): Promise<Contract> {
    const connection = await dbPool.getConnection();

    try {
      await connection.beginTransaction();

      // Verificar disponibilidad de la propiedad
      const [propertyRows] = await connection.query<RowDataPacket[]>(
        'SELECT status FROM properties WHERE id = ? FOR UPDATE',
        [contract.propertyId]
      );

      if (propertyRows.length === 0) {
        throw new Error('La propiedad no existe.');
      }

      if (propertyRows[0].status !== PropertyStatus.AVAILABLE) {
        throw new Error('La propiedad no está disponible para arrendamiento.');
      }

      // Insertar contrato
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO contracts (propertyId, tenantId, startDate, endDate, monthlyAmount, depositAmount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          contract.propertyId,
          contract.tenantId,
          contract.startDate,
          contract.endDate,
          contract.monthlyAmount,
          contract.depositAmount,
          ContractStatus.ACTIVE,
        ]
      );

      // Cambiar estado de la propiedad a RENTED
      await connection.query(
        'UPDATE properties SET status = ? WHERE id = ?',
        [PropertyStatus.RENTED, contract.propertyId]
      );

      await connection.commit();

      return {
        id: result.insertId,
        ...contract,
        status: ContractStatus.ACTIVE,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  public async updateContractStatus(id: number, status: ContractStatus): Promise<boolean> {
    const connection = await dbPool.getConnection();

    try {
      await connection.beginTransaction();

      const [contractRows] = await connection.query<RowDataPacket[]>(
        'SELECT propertyId FROM contracts WHERE id = ? FOR UPDATE',
        [id]
      );

      if (contractRows.length === 0) {
        throw new Error('Contrato no encontrado.');
      }

      const propertyId = contractRows[0].propertyId;

      const [result] = await connection.query<ResultSetHeader>(
        'UPDATE contracts SET status = ? WHERE id = ?',
        [status, id]
      );

      // Si el contrato finaliza o se cancela, liberar la propiedad
      if (status === ContractStatus.COMPLETED || status === ContractStatus.CANCELLED) {
        await connection.query(
          'UPDATE properties SET status = ? WHERE id = ?',
          [PropertyStatus.AVAILABLE, propertyId]
        );
      }

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  public async updateContract(id:number, contract:Partial<Contract>):Promise<boolean>{
    const [result]=await dbPool.query<ResultSetHeader>(`UPDATE contracts SET startDate=COALESCE(?,startDate), endDate=COALESCE(?,endDate), monthlyAmount=COALESCE(?,monthlyAmount), depositAmount=COALESCE(?,depositAmount), status=COALESCE(?,status) WHERE id=?`,[contract.startDate??null,contract.endDate??null,contract.monthlyAmount??null,contract.depositAmount??null,contract.status??null,id]);
    return result.affectedRows>0;
  }
  public async deleteContract(id:number):Promise<boolean>{
    const connection=await dbPool.getConnection();
    try{await connection.beginTransaction();const [rows]=await connection.query<RowDataPacket[]>('SELECT propertyId,status FROM contracts WHERE id=? FOR UPDATE',[id]);if(!rows.length){await connection.rollback();return false;}await connection.query('DELETE FROM contracts WHERE id=?',[id]);if(rows[0].status===ContractStatus.ACTIVE)await connection.query('UPDATE properties SET status=? WHERE id=?',[PropertyStatus.AVAILABLE,rows[0].propertyId]);await connection.commit();return true;}catch(error){await connection.rollback();throw error;}finally{connection.release();}
  }
}