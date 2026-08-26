import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

/**
 * Traduce los errores HTTP a un mensaje que se pueda enseñar al usuario y
 * cierra la sesión cuando el token deja de ser válido.
 *
 * El mensaje se adjunta como `error.mensajeUsuario` para que cada pantalla
 * decida dónde mostrarlo.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        // El token caducó o dejó de ser válido: se vuelve a pedir acceso.
        tokenService.clear();
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }

      Object.assign(error, { mensajeUsuario: describir(error) });
      return throwError(() => error);
    }),
  );
};

function describir(error: HttpErrorResponse): string {
  // La API responde con el formato ErrorResponse { status, error, message, path }.
  const mensajeApi: string | undefined = error.error?.message;

  switch (error.status) {
    case 0:
      return 'No se pudo contactar al servidor. Verifique su conexión e intente de nuevo.';
    case 401:
      return 'Su sesión expiró. Vuelva a iniciar sesión.';
    case 403:
      return 'No tiene permisos para realizar esta operación.';
    case 404:
      return mensajeApi ?? 'No se encontró la información solicitada.';
    case 409:
      return mensajeApi ?? 'La operación entra en conflicto con datos ya registrados.';
    case 400:
      return mensajeApi ?? 'Revise los datos capturados: hay campos incorrectos.';
    default:
      return mensajeApi ?? 'Ocurrió un error al procesar la solicitud. Intente de nuevo.';
  }
}

/** Mensaje listo para mostrar que el interceptor adjunta a cada error. */
export function mensajeDeError(error: unknown): string {
  return (
    (error as { mensajeUsuario?: string })?.mensajeUsuario ??
    'Ocurrió un error al procesar la solicitud. Intente de nuevo.'
  );
}
