import jwt, { SignOptions } from 'jsonwebtoken';
import { ENVIRONMENT } from '../config/environment.js';

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

// Genera un token JWT firmado
export const generateToken = (payload: JwtPayload, expiresIn: string = '24h'): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign(payload, ENVIRONMENT.JWT_SECRET, options);
};

// Verifica y decodifica un token JWT
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, ENVIRONMENT.JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};