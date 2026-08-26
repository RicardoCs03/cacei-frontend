import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Rol } from '../models/auth.model';

/**
 * Restringe una sección al rol indicado.
 *
 * Si el usuario tiene otro rol se le envía a su propio panel en lugar de dejar
 * la navegación bloqueada sin explicación.
 */
export const roleGuard = (rol: Rol): CanActivateFn => {
  return () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const rolActual = tokenService.getRole();

    if (rolActual === rol) {
      return true;
    }

    if (rolActual) {
      return router.createUrlTree([rolActual === 'ADMINISTRADOR' ? '/admin' : '/profesor']);
    }

    return router.createUrlTree(['/login']);
  };
};
