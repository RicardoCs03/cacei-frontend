import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { Rol } from '../../core/models/auth.model';

interface OpcionMenu {
  etiqueta: string;
  ruta: string;
  /** Solo marca activa la opción con la ruta exacta (para "Inicio"). */
  exacta?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly tokenService = inject(TokenService);

  readonly rol: Rol | null = this.tokenService.getRole();

  private readonly menuAdministrador: OpcionMenu[] = [
    { etiqueta: 'Inicio', ruta: '/admin', exacta: true },
    { etiqueta: 'Usuarios', ruta: '/admin/usuarios' },
    { etiqueta: 'Programas de estudio', ruta: '/admin/programas-educativos' },
    { etiqueta: 'Experiencias educativas', ruta: '/admin/experiencias-educativas' },
    { etiqueta: 'Cursos', ruta: '/admin/cursos' },
    { etiqueta: 'Alumnos', ruta: '/admin/alumnos' },
    { etiqueta: 'Inscripciones', ruta: '/admin/inscripciones' },
    { etiqueta: 'Acreditaciones CACEI', ruta: '/admin/acreditaciones' },
  ];

  private readonly menuProfesor: OpcionMenu[] = [
    { etiqueta: 'Inicio', ruta: '/profesor', exacta: true },
    { etiqueta: 'Mis cursos', ruta: '/profesor/cursos' },
  ];

  get titulo(): string {
    return this.rol === 'ADMINISTRADOR' ? 'Administración' : 'Profesor';
  }

  get opciones(): OpcionMenu[] {
    if (this.rol === 'ADMINISTRADOR') {
      return this.menuAdministrador;
    }
    if (this.rol === 'PROFESOR') {
      return this.menuProfesor;
    }
    return [];
  }
}
