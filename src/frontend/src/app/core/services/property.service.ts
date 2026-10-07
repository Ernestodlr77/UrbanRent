import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Property {
  [key: string]: any;
  id?: number;
  title: string;
  propertyType?: string;
  countryCode?: string;
  address?: string;
  description?: string;
  city?: string;
  countryName?: string;
  currencyCode?: string;
  monthlyRent?: number;
  status?: string;
}
export interface PropertyPage { data: Property[]; pagination: {page:number; limit:number; total:number; totalPages:number}; }
@Injectable({providedIn:'root'})
export class PropertyService {
  private http=inject(HttpClient); private apiUrl=`${environment.apiUrl}/properties`;
  getAll(filters:{page?:number;limit?:number;search?:string;status?:string;type?:string;country?:string}={}):Observable<PropertyPage>{
    let params=new HttpParams(); Object.entries(filters).forEach(([k,v])=>{if(v!==undefined && v!==null && v!=='')params=params.set(k,String(v));});
    return this.http.get<PropertyPage>(this.apiUrl,{params});
  }
  getById(id:number){return this.http.get<Property>(`${this.apiUrl}/${id}`)}
  create(data:Partial<Property>){return this.http.post(`${this.apiUrl}`,data)}
  update(id:number,data:Partial<Property>){return this.http.put(`${this.apiUrl}/${id}`,data)}
  delete(id:number){return this.http.delete(`${this.apiUrl}/${id}`)}
}
