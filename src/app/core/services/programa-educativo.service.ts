import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgramaEducativo } from '../models/programaEducativo.model';
@Injectable({
  providedIn: 'root',
})
export class ProgramaEducativoService {
  
  private API_URL = 'http://localhost:9090/api/programas-educativos';

  constructor(private http: HttpClient) {}

  findAll(): Observable<ProgramaEducativo[]> {
    return this.http.get<ProgramaEducativo[]>(this.API_URL);
  }

  findById(id: number): Observable<ProgramaEducativo> {
    return this.http.get<ProgramaEducativo>(`${this.API_URL}/${id}`);
  }

  create(program: ProgramaEducativo): Observable<ProgramaEducativo> {
    return this.http.post<ProgramaEducativo>(this.API_URL, program);
  }

  update(id: number, program: ProgramaEducativo): Observable<ProgramaEducativo> {
    return this.http.put<ProgramaEducativo>(`${this.API_URL}/actualizar-programa-educativo/${id}`, program);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/eliminar-programa-educativo/${id}`);
  }

}
