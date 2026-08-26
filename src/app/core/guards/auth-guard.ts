import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/** Exige una sesión válida; si no la hay, lleva al login conservando el destino. */
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.isLogged()) {
    return true;
  }

  // La sesión pudo haber caducado: se limpia para no dejar restos inservibles.
  tokenService.clear();
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
