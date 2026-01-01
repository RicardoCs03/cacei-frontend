import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExperienciaEducativa } from '../models/experienciaEducativa.model';

@Injectable({
  providedIn: 'root',
})
export class ExperienciaEducativaService {
  
  private API_URL = 'http://localhost:9090/api/experiencias-educativas';

  constructor(private http: HttpClient) {}

  findAll(): Observable<ExperienciaEducativa[]> {
    return this.http.get<ExperienciaEducativa[]>(this.API_URL);
  }

  // findByProgram(programaId: number): Observable<ExperienciaEducativa[]> {
  //   return this.http.get<ExperienciaEducativa[]>(
  //     `${this.API_URL}/programa/${programaId}`
  //   );
  // }

  findById(id: number): Observable<ExperienciaEducativa> {
    return this.http.get<ExperienciaEducativa>(`${this.API_URL}/${id}`);
  }

  create(data: ExperienciaEducativa): Observable<ExperienciaEducativa> {
    return this.http.post<ExperienciaEducativa>(this.API_URL, data);
  }

  update(id: number, data: ExperienciaEducativa): Observable<ExperienciaEducativa> {
    return this.http.patch<ExperienciaEducativa>(`${this.API_URL}/actualizar-experiencia-educativa/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/eliminar-experiencia-educativa/${id}`);
  }

}
