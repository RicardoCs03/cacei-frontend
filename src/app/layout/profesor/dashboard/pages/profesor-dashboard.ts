import { Component, inject } from '@angular/core';
import { TokenService } from '../../../../core/services/token.service';

@Component({
  selector: 'app-profesor-dashboard',
  standalone: true,
  templateUrl: './profesor-dashboard.html',
})
export class ProfesorDashboard {
  private readonly tokenService = inject(TokenService);

  /** Nombre completo del profesor; si faltara, se saluda de forma genérica. */
  readonly nombre = this.tokenService.getNombre() ?? 'Profesor';
}
