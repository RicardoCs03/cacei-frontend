import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscripcion, InscripcionResponse } from '../models/inscripcion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {

  API_URL = `${environment.apiUrl}/inscripciones`;

  constructor(private http: HttpClient) {}

  // ADMIN
  findAll(): Observable<InscripcionResponse[]> {
    return this.http.get<InscripcionResponse[]>(`${this.API_URL}`);
  }

  findById(id: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>(`${this.API_URL}/${id}`);
  }

  create(data: Inscripcion): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(`${this.API_URL}`, data);
  }

  update(id: number, data: Inscripcion): Observable<Inscripcion> {
    return this.http.patch<Inscripcion>(`${this.API_URL}/actualizar-inscripcion/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/eliminar-inscripcion/${id}`);
  }

  // PROFESOR (solo lectura)
  findByCurso(cursoId: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(
      `${this.API_URL}/profesor/cursos/${cursoId}/inscripciones`
    );
  }
}

  
