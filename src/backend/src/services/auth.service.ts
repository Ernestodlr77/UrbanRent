import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbPool } from '../config/database.js';
import { ENVIRONMENT } from '../config/environment.js';
import { User, UserRole } from '../models/User.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class InvalidCredentialsError extends Error { constructor(){ super('Credenciales inválidas.'); this.name='InvalidCredentialsError'; } }

export class AuthService {
  public async login(email:string,password:string):Promise<{token:string;user:Partial<User>}> {
    const [rows]=await dbPool.query<RowDataPacket[]>('SELECT id, fullName, email, password, role, phone FROM users WHERE email=?',[email]);
    if(!rows.length) throw new InvalidCredentialsError();
    const user=rows[0] as User;
    if(!await bcrypt.compare(password,user.password||'')) throw new InvalidCredentialsError();
    const token=jwt.sign({id:user.id,email:user.email,role:user.role},ENVIRONMENT.JWT_SECRET,{expiresIn:'24h'});
    return {token,user:{id:user.id,fullName:user.fullName,email:user.email,role:user.role,phone:user.phone}};
  }
  public async register(userData:User):Promise<Partial<User>> {
    const [existing]=await dbPool.query<RowDataPacket[]>('SELECT id FROM users WHERE email=?',[userData.email]);
    if(existing.length) throw new Error('El correo electrónico ya se encuentra registrado.');
    if(typeof userData.password!=='string'||userData.password.length<8) throw new Error('La contraseña debe tener al menos 8 caracteres.');
    if(!userData.fullName?.trim()||!userData.email?.trim()) throw new Error('Nombre y correo son obligatorios.');
    const hashedPassword=await bcrypt.hash(userData.password,10);
    const role=userData.role===UserRole.LANDLORD?UserRole.LANDLORD:UserRole.TENANT;
    const [result]=await dbPool.query<ResultSetHeader>('INSERT INTO users (fullName,email,password,role,phone) VALUES (?,?,?,?,?)',[userData.fullName.trim(),userData.email.trim().toLowerCase(),hashedPassword,role,userData.phone||null]);
    return {id:result.insertId,fullName:userData.fullName,email:userData.email,role,phone:userData.phone};
  }
  public async getProfile(userId:number):Promise<Partial<User>|null>{
    const [rows]=await dbPool.query<RowDataPacket[]>('SELECT id,fullName,email,role,phone,createdAt,updatedAt FROM users WHERE id=?',[userId]);
    return rows.length?rows[0] as Partial<User>:null;
  }
  public async updateProfile(userId:number,data:{fullName?:string;phone?:string}):Promise<Partial<User>|null>{
    if(data.fullName!==undefined&&!data.fullName.trim()) throw new Error('El nombre completo es obligatorio.');
    const [result]=await dbPool.query<ResultSetHeader>('UPDATE users SET fullName=COALESCE(?,fullName), phone=COALESCE(?,phone) WHERE id=?',[data.fullName?.trim()||null,data.phone??null,userId]);
    return result.affectedRows?this.getProfile(userId):null;
  }
}
