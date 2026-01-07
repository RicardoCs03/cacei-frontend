import { Injectable } from '@angular/core';
import { AtributoEgreso } from '../models/atributoEgreso.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AtributoEgresoService {
  API_URL = 'http://localhost:9090/api/atributos-egreso';

  constructor(private http: HttpClient) {}

   public findAll(): Observable<AtributoEgreso[]> {
    return this.http.get<AtributoEgreso[]>(this.API_URL);
  }

  public findById(id: number): Observable<AtributoEgreso> {
    return this.http.get<AtributoEgreso>(`${this.API_URL}/${id}`);
  }

  public findByPlanEstudio(rPlanEstudio: string): Observable<AtributoEgreso[]> {
    return this.http.get<AtributoEgreso[]>(`${this.API_URL}/${rPlanEstudio}`);
  }

  public create(data: AtributoEgreso): Observable<AtributoEgreso> {
    return this.http.post<AtributoEgreso>(this.API_URL, data);
  }

  public update(id: number, data: AtributoEgreso): Observable<AtributoEgreso> {
    return this.http.patch<AtributoEgreso>(`${this.API_URL}/actualizar-atributo-egreso/${id}`, data);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/eliminar-atributo-egreso/${id}`);
  }
  
}
