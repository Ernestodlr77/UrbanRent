import dotenv from 'dotenv';

dotenv.config();

const requiredSecret = process.env.JWT_SECRET;
if (!requiredSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET es obligatorio en producción.');
}

export const ENVIRONMENT = {
  PORT: Number(process.env.PORT) || 3000,
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'urbanrent_db',
    PORT: Number(process.env.DB_PORT) || 3306,
  },
  JWT_SECRET: requiredSecret || 'urbanrent-development-secret-change-me',
};
