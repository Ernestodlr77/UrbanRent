import { Request, Response } from 'express';
import { AuthService, InvalidCredentialsError } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import { validateRegistration } from '../utils/validators.js';
export class AuthController {
  private authService=new AuthService();
  public login=async(req:Request,res:Response):Promise<void>=>{try{const{email,password}=req.body;if(typeof email!=='string'||typeof password!=='string'||!email.trim()||!password){res.status(400).json({message:'El correo y la contraseña son requeridos.'});return;}res.status(200).json(await this.authService.login(email.trim().toLowerCase(),password));}catch(error){if(error instanceof InvalidCredentialsError){res.status(401).json({message:'Error de autenticación: Credenciales inválidas.'});return;}console.error('Error en login:',error);res.status(500).json({message:'Error interno del servidor.'});}};
  public register=async(req:Request,res:Response):Promise<void>=>{try{const validation=validateRegistration(req.body);if(!validation.valid){res.status(400).json({message:'message' in validation ? validation.message : 'Datos inválidos'});return;}const user=await this.authService.register(req.body);res.status(201).json({message:'Usuario registrado exitosamente.',user});}catch(error:any){res.status(400).json({message:error.message||'Error al registrar el usuario.'});}};
  public profile=async(req:AuthenticatedRequest,res:Response):Promise<void>=>{try{const user=await this.authService.getProfile(req.user!.id);if(!user){res.status(404).json({message:'Usuario no encontrado.'});return;}res.json(user);}catch(error:any){res.status(500).json({message:error.message||'Error al consultar el perfil.'});}};
  public updateProfile=async(req:AuthenticatedRequest,res:Response):Promise<void>=>{try{const user=await this.authService.updateProfile(req.user!.id,req.body);if(!user){res.status(404).json({message:'Usuario no encontrado.'});return;}res.json({message:'Perfil actualizado correctamente.',user});}catch(error:any){res.status(400).json({message:error.message||'Error al actualizar el perfil.'});}};
}
