import { dbPool } from '../config/database.js';
import { Property, PropertyStatus, PropertyType } from '../models/Property.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const PROPERTY_COLUMNS = `
  id, landlordId, title, description, address, city, countryCode, countryName,
  propertyType, monthlyRent, currencyCode, latitude, longitude, status, createdAt, updatedAt
`;

export class PropertyService {
  public async getAllProperties(options: { page?: number; limit?: number; search?: string; status?: string; type?: string; country?: string } = {}): Promise<{ data: Property[]; pagination: { page:number; limit:number; total:number; totalPages:number } }> {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 12));
    const offset = (page - 1) * limit;
    const where:string[]=[]; const params:any[]=[];
    if (options.search?.trim()) { where.push('(title LIKE ? OR city LIKE ? OR countryName LIKE ? OR address LIKE ?)'); const q=`%${options.search.trim()}%`; params.push(q,q,q,q); }
    if (options.status && options.status !== 'ALL') { where.push('status = ?'); params.push(options.status); }
    if (options.type && options.type !== 'ALL') { where.push('propertyType = ?'); params.push(options.type); }
    if (options.country && options.country !== 'ALL') { where.push('countryCode = ?'); params.push(options.country); }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [countRows] = await dbPool.query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM properties ${clause}`, params);
    const total = Number(countRows[0]?.total || 0);
    const [rows] = await dbPool.query<RowDataPacket[]>(`SELECT ${PROPERTY_COLUMNS} FROM properties ${clause} ORDER BY countryName, city, title LIMIT ? OFFSET ?`, [...params, limit, offset]);
    return { data: rows as Property[], pagination: { page, limit, total, totalPages: Math.ceil(total/limit) } };
  }

  public async getPropertyById(id: number): Promise<Property | null> {
    const [rows] = await dbPool.query<RowDataPacket[]>(
      `SELECT ${PROPERTY_COLUMNS} FROM properties WHERE id = ?`,
      [id]
    );
    return rows.length ? rows[0] as Property : null;
  }

  public async createProperty(property: Property): Promise<Property> {
    const [result] = await dbPool.query<ResultSetHeader>(
      `INSERT INTO properties
      (landlordId, title, description, address, city, countryCode, countryName,
       propertyType, monthlyRent, currencyCode, latitude, longitude, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        property.landlordId,
        property.title,
        property.description || null,
        property.address,
        property.city,
        property.countryCode,
        property.countryName,
        property.propertyType || PropertyType.APARTMENT,
        property.monthlyRent,
        property.currencyCode,
        property.latitude,
        property.longitude,
        property.status || PropertyStatus.AVAILABLE
      ]
    );

    return { ...property, id: result.insertId, status: property.status || PropertyStatus.AVAILABLE };
  }

  public async updateProperty(id: number, property: Partial<Property>): Promise<boolean> {
    const [result] = await dbPool.query<ResultSetHeader>(
      `UPDATE properties SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        countryCode = COALESCE(?, countryCode),
        countryName = COALESCE(?, countryName),
        propertyType = COALESCE(?, propertyType),
        monthlyRent = COALESCE(?, monthlyRent),
        currencyCode = COALESCE(?, currencyCode),
        latitude = COALESCE(?, latitude),
        longitude = COALESCE(?, longitude),
        status = COALESCE(?, status)
      WHERE id = ?`,
      [
        property.title, property.description, property.address, property.city,
        property.countryCode, property.countryName, property.propertyType,
        property.monthlyRent, property.currencyCode, property.latitude,
        property.longitude, property.status, id
      ]
    );
    return result.affectedRows > 0;
  }

  public async deleteProperty(id: number): Promise<boolean> {
    const [result] = await dbPool.query<ResultSetHeader>(
      'DELETE FROM properties WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}
