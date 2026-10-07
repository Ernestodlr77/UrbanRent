import { Request, Response } from 'express';
import { dbPool } from '../config/database.js';
import { RowDataPacket } from 'mysql2';

export class DashboardController {
  public stats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const [property] = await dbPool.query<RowDataPacket[]>(`SELECT COUNT(*) total, SUM(status='AVAILABLE') available, SUM(status='RENTED') rented, SUM(status='MAINTENANCE') maintenance FROM properties`);
      const [contracts] = await dbPool.query<RowDataPacket[]>(`SELECT COUNT(*) total, SUM(status='ACTIVE') active FROM contracts`);
      const [payments] = await dbPool.query<RowDataPacket[]>(`SELECT COALESCE(SUM(CASE WHEN status='PAID' THEN amount ELSE 0 END),0) collected, COALESCE(SUM(CASE WHEN status='PENDING' THEN amount ELSE 0 END),0) pending FROM payments`);
      const [types] = await dbPool.query<RowDataPacket[]>(`SELECT propertyType type, COUNT(*) count FROM properties GROUP BY propertyType ORDER BY count DESC`);
      res.json({ properties: property[0], contracts: contracts[0], payments: payments[0], propertyTypes: types });
    } catch(error:any) { res.status(500).json({ message:error.message || 'Error al obtener estadísticas.' }); }
  };
}
