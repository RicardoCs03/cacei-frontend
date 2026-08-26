import { Injectable } from '@angular/core';
import { Rol } from '../models/auth.model';

/**
 * Guarda la sesión del usuario en el almacenamiento local del navegador.
 *
 * El token es un JWT emitido por la API; el rol y el nombre se conservan aparte
 * para no tener que decodificarlo en cada render del menú.
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN = 'cacei.token';
  private readonly ROL = 'cacei.rol';
  private readonly NOMBRE = 'cacei.nombre';

  save(token: string, rol: Rol, nombre: string): void {
    localStorage.setItem(this.TOKEN, token);
    localStorage.setItem(this.ROL, rol);
    localStorage.setItem(this.NOMBRE, nombre);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN);
  }

  getRole(): Rol | null {
    return localStorage.getItem(this.ROL) as Rol | null;
  }

  getNombre(): string | null {
    return localStorage.getItem(this.NOMBRE);
  }

  /** Hay sesión si el token existe y aún no ha expirado. */
  isLogged(): boolean {
    const token = this.getToken();
    return !!token && !this.haExpirado(token);
  }

  clear(): void {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.ROL);
    localStorage.removeItem(this.NOMBRE);
  }

  /**
   * Lee la fecha de expiración del JWT sin validar la firma: sirve para no
   * enviar peticiones que la API va a rechazar, no como control de seguridad.
   * Esa comprobación la hace siempre el backend.
   */
  private haExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) {
        return false;
      }
      return payload.exp * 1000 <= Date.now();
    } catch {
      // Un token que no se puede leer no sirve para nada.
      return true;
    }
  }
}
