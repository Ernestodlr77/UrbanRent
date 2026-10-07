import mysql from 'mysql2/promise';
import { ENVIRONMENT } from './environment.js';

// Crear el pool de conexiones MySQL
export const dbPool = mysql.createPool({
  host: ENVIRONMENT.DB.HOST,
  user: ENVIRONMENT.DB.USER,
  password: ENVIRONMENT.DB.PASSWORD,
  database: ENVIRONMENT.DB.NAME,
  port: ENVIRONMENT.DB.PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para verificar la conexión inicial a la base de datos
export const checkDatabaseConnection = async (): Promise<void> => {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ [UrbanRent DB] Conexión exitosa a la base de datos MySQL.');
    connection.release();
  } catch (error) {
    console.error('❌ [UrbanRent DB] Error al conectar con la base de datos:', error);
  }
};