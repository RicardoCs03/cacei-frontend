import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, Rol } from '../models/auth.model';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  /** Autentica al usuario y deja la sesión guardada. */
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, data)
      .pipe(tap((respuesta) => this.tokenService.save(respuesta.token, respuesta.role, respuesta.nombre)));
  }

  /** Cierra la sesión y devuelve al formulario de acceso. */
  logout(returnUrl?: string): void {
    this.tokenService.clear();
    this.router.navigate(['/login'], returnUrl ? { queryParams: { returnUrl } } : {});
  }

  /** Ruta de inicio que corresponde a cada rol. */
  rutaInicio(rol: Rol): string {
    return rol === 'ADMINISTRADOR' ? '/admin' : '/profesor';
  }
}
