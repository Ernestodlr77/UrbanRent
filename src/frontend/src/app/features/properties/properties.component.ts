import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, Property } from '../../core/services/property.service';

@Component({selector:'app-properties',standalone:true,imports:[CommonModule],templateUrl:'./properties.component.html',styleUrl:'./properties.component.css'})
export class PropertiesComponent implements OnInit {
  private readonly service=inject(PropertyService); private readonly route=inject(ActivatedRoute); private readonly router=inject(Router);
  properties:Property[]=[]; searchTerm=''; statusFilter='ALL'; page=1; limit=12; total=0; totalPages=1; loading=false; message='';
  ngOnInit(){this.route.queryParamMap.subscribe(p=>{this.searchTerm=p.get('search')?.toLowerCase()??''; this.loadProperties(1);});}
  loadProperties(page=this.page){this.loading=true; this.service.getAll({page,limit:this.limit,search:this.searchTerm,status:this.statusFilter}).subscribe({next:r=>{this.properties=r.data;this.page=r.pagination.page;this.total=r.pagination.total;this.totalPages=r.pagination.totalPages;this.loading=false;},error:e=>{this.message=e?.error?.message||'No se pudieron cargar las propiedades.';this.loading=false;}})}
  nextPage(){if(this.page<this.totalPages)this.loadProperties(this.page+1)} previousPage(){if(this.page>1)this.loadProperties(this.page-1)}
  applyFilters(){this.loadProperties(1)}
  newProperty(){this.router.navigate(['/properties'],{queryParams:{mode:'new'}}); alert('Para registrar una propiedad utiliza POST /api/properties o el módulo de administración.');}
  deleteProperty(id:number){if(!confirm('¿Eliminar esta propiedad?'))return; this.service.delete(id).subscribe({next:()=>this.loadProperties(this.page),error:e=>this.message=e?.error?.message||'No se pudo eliminar.'});}
}
