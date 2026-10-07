import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSummary(): Observable<any> { return this.http.get(`${this.apiUrl}/summary`); }
  update(id:number,data:any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`,data); }
  delete(id:number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}