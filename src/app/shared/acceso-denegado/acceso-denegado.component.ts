import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { AuthService } from '../../core/services/auth.service';

/**
 * Pantalla completa que se muestra cuando alguien intenta entrar a una sección
 * que su rol no tiene permitida.
 *
 * No se detalla ni el rol de la cuenta ni la ruta solicitada: para quien llega
 * por error no aportan nada, y para quien está probando direcciones a mano son
 * una confirmación que no hace falta darle.
 *
 * Esta pantalla es comodidad de navegación, no una frontera de seguridad. Quien
 * la esquive se topa igualmente con el 403 de la API, que es lo que protege los
 * datos de verdad.
 */
@Component({
  selector: 'app-acceso-denegado',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div
        class="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center space-y-6"
        role="alert"
      >
        <p class="font-mono text-sm tracking-widest text-slate-400">ERROR 403</p>

        <h1 class="text-2xl font-semibold text-slate-800">Acceso no permitido</h1>

        <div class="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button type="button" class="btn-primary" (click)="irAMiPanel()">
            Volver a mi panel
          </button>

          <button type="button" class="btn-outline" (click)="cerrarSesion()">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AccesoDenegadoComponent {
  private readonly tokenService = inject(TokenService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  irAMiPanel(): void {
    const rol = this.tokenService.getRole();
    if (!rol) {
      this.authService.logout();
      return;
    }
    this.router.navigateByUrl(this.authService.rutaInicio(rol));
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
