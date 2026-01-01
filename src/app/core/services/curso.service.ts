import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../models/cursos.model';

@Injectable({
  providedIn: 'root',
})
export class CursoService {
  
  private API_URL = 'http://localhost:9090/api/cursos';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.API_URL);
  }

  findById(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.API_URL}/${id}`);
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
