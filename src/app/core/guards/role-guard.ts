import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Rol } from '../models/auth.model';

/**
 * Restringe una sección al rol indicado.
 *
 * Con otro rol se muestra la pantalla de acceso denegado en vez de rebotar en
 * silencio, pero sin detallar el rol de la cuenta ni la seccion solicitada.
 *
 * Es una comodidad de navegación, no una frontera de seguridad. Quien se salte
 * el guard se topa igualmente con el 403 de la API, que es lo que protege de
 * verdad los datos.
 */
export const roleGuard = (rol: Rol): CanActivateFn => {
  return (_ruta, estado) => {
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const rolActual = tokenService.getRole();

    if (rolActual === rol) {
      return true;
    }

    if (rolActual) {
      // Sin la ruta solicitada en la URL: no hace falta dejarla a la vista.
      return router.createUrlTree(['/acceso-denegado']);
    }

    return router.createUrlTree(['/login'], { queryParams: { returnUrl: estado.url } });
  };
};
