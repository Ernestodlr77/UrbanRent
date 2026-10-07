import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';

@Component({selector:'app-payments',standalone:true,imports:[CommonModule],templateUrl:'./payments.component.html',styleUrl:'./payments.component.css'})
export class PaymentsComponent implements OnInit {
  private readonly paymentService=inject(PaymentService);
  payments:any[]=[];
  ngOnInit(){this.loadPayments()}
  loadPayments(){this.paymentService.getAll().subscribe({next:data=>this.payments=data,error:err=>console.error(err)})}
  statusLabel(status:string){return ({PAID:'Pagado',PENDING:'Pendiente',LATE:'Atrasado'} as Record<string,string>)[status]??status}
  markPaid(item:any){this.paymentService.update(item.id,{status:'PAID',paidDate:new Date().toISOString()}).subscribe({next:()=>this.loadPayments(),error:err=>alert(err?.error?.message||'No se pudo actualizar.')});}
  remove(item:any){if(!confirm(`¿Eliminar pago #${item.id}?`))return;this.paymentService.delete(item.id).subscribe({next:()=>this.loadPayments(),error:err=>alert(err?.error?.message||'No se pudo eliminar.')});}
}
