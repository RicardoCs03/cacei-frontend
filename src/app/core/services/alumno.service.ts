import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno.model';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService {

  API_URL = 'http://localhost:9090/api/alumnos';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.API_URL);
  }

  findById(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.API_URL}/${id}`);
  }

  create(data: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.API_URL, data);
  }

  update(id: number, data: Alumno): Observable<Alumno> {
    return this.http.patch<Alumno>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  
}
