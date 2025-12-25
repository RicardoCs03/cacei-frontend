import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9090/api/auth';//URL base de la API de autenticación

  //Constructor de la clase
  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {// Método para iniciar sesión
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data,{headers: { 'Content-Type': 'application/json' }}
    );
  }
}
