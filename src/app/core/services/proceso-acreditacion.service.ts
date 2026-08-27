import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProcesoAcreditacionRequest, ProcesoAcreditacionResponse } from '../models/procesoAcreditacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProcesoAcreditacionService {

  API_URL = `${environment.apiUrl}/proceso-acreditacion`;

  constructor(private http: HttpClient) {}

  findById(id: number): Observable<ProcesoAcreditacionResponse> {
    return this.http.get<ProcesoAcreditacionResponse>(`${this.API_URL}/${id}`);
  }

  findAll(): Observable<ProcesoAcreditacionResponse[]> {
    return this.http.get<ProcesoAcreditacionResponse[]>(`${this.API_URL}/`);
  }

  create(data: ProcesoAcreditacionRequest): Observable<ProcesoAcreditacionResponse> {
    return this.http.post<ProcesoAcreditacionResponse>(`${this.API_URL}/`, data);
  }

  update(id: number, data: ProcesoAcreditacionRequest): Observable<ProcesoAcreditacionResponse> {
    return this.http.patch<ProcesoAcreditacionResponse>(`${this.API_URL}/actualizar-proceso-acreditacion/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/eliminar-proceso-acreditacion/${id}`);
  }
}
