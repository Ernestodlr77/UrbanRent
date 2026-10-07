import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../core/services/contract.service';

@Component({
  selector:'app-contracts', standalone:true, imports:[CommonModule],
  templateUrl:'./contracts.component.html', styleUrl:'./contracts.component.css'
})
export class ContractsComponent implements OnInit {
  private readonly contractService=inject(ContractService);
  contracts:any[]=[];
  ngOnInit(){this.loadContracts()}
  loadContracts(){this.contractService.getAll().subscribe({next:data=>this.contracts=data,error:err=>console.error(err)})}
  statusLabel(status:string){return ({ACTIVE:'Activo',COMPLETED:'Finalizado',CANCELLED:'Cancelado'} as Record<string,string>)[status]??status}
  complete(item:any){this.contractService.update(item.id,{status:'COMPLETED'}).subscribe({next:()=>this.loadContracts(),error:err=>alert(err?.error?.message||'No se pudo actualizar.')});}
  remove(item:any){if(!confirm(`¿Eliminar contrato #${item.id}?`))return;this.contractService.delete(item.id).subscribe({next:()=>this.loadContracts(),error:err=>alert(err?.error?.message||'No se pudo eliminar.')});}
}
