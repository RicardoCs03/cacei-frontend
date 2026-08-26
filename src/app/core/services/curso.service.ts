import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../models/cursos.model';
import { CursoInscripcionesDTO } from '../models/curso.inscripciones.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  
  private API_URL = `${environment.apiUrl}/cursos`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.API_URL);
  }

  findById(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.API_URL}/${id}`);
  }

  findByProfesor(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${this.API_URL}/profesor`);
  }

  getDetalleCurso(cursoId: number) {
  return this.http.get<CursoInscripcionesDTO>(
    `${this.API_URL}/${cursoId}/detalle-inscripciones`
  );
}

  create(data: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.API_URL, data);
  }

  update(id: number, data: Curso): Observable<Curso> {
    return this.http.patch<Curso>(`${this.API_URL}/actualizar-curso/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/eliminar-curso/${id}`);
  }

}
