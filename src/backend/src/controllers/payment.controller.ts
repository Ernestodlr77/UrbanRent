import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { validatePayment } from '../utils/validators.js';
export class PaymentController {
  private paymentService=new PaymentService();
  public getAll=async(_req:Request,res:Response):Promise<void>=>{try{res.json(await this.paymentService.getAllPayments());}catch(error:any){res.status(500).json({message:error.message||'Error al obtener pagos.'});}};
  public getByContract=async(req:Request,res:Response):Promise<void>=>{try{res.json(await this.paymentService.getPaymentsByContract(Number(req.params.contractId)));}catch(error:any){res.status(500).json({message:error.message||'Error al obtener pagos del contrato.'});}};
  public registerPayment=async(req:Request,res:Response):Promise<void>=>{try{const v=validatePayment(req.body);if(!v.valid){res.status(400).json({message:'message' in v ? v.message : 'Datos inválidos'});return;}res.status(201).json({message:'Pago registrado y procesado con éxito.',payment:await this.paymentService.registerPayment(req.body)});}catch(error:any){res.status(400).json({message:error.message||'Error al registrar pago.'});}};
  public update=async(req:Request,res:Response):Promise<void>=>{try{const v=validatePayment(req.body,true);if(!v.valid){res.status(400).json({message:'message' in v ? v.message : 'Datos inválidos'});return;}const ok=await this.paymentService.updatePayment(Number(req.params.id),req.body);if(!ok){res.status(404).json({message:'Pago no encontrado.'});return;}res.json({message:'Pago actualizado correctamente.'});}catch(error:any){res.status(400).json({message:error.message||'Error al actualizar pago.'});}};
  public delete=async(req:Request,res:Response):Promise<void>=>{try{const ok=await this.paymentService.deletePayment(Number(req.params.id));if(!ok){res.status(404).json({message:'Pago no encontrado.'});return;}res.json({message:'Pago eliminado correctamente.'});}catch(error:any){res.status(500).json({message:error.message||'Error al eliminar pago.'});}};
  public getFinancialSummary=async(_req:Request,res:Response):Promise<void>=>{try{res.json(await this.paymentService.getFinancialSummary());}catch(error:any){res.status(500).json({message:error.message||'Error al obtener resumen financiero.'});}};
}
