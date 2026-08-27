import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { ListaBase } from '../../../../shared/lista-base';
import { DefinicionFiltro } from '../../../../shared/filtros/filtro.model';
import { FiltrosComponent } from '../../../../shared/filtros/filtros.component';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent, FiltrosComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent extends ListaBase<Usuario> implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);

  protected override get entidad(): string {
    return 'usuarios';
  }

  protected override consultar(): Observable<Usuario[]> {
    return this.usuarioService.findAll();
  }

  override get filtros(): DefinicionFiltro<Usuario>[] {
    return [
      { clave: 'email', etiqueta: 'Correo', tipo: 'texto', ejemplo: 'Ej. uv.mx',
        valor: (u) => u.email },
      { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto', ejemplo: 'Nombre o apellidos',
        valor: (u) => `${u.nombre ?? ''} ${u.apepat ?? ''} ${u.apemat ?? ''}` },
      // El rol viene del catálogo Roles: desplegable.
      { clave: 'rol', etiqueta: 'Rol', tipo: 'seleccion',
        valor: (u) => u.rol,
        etiquetaOpcion: (v) => this.etiquetaRol(v) },
    ];
  }

  ngOnInit(): void {
    this.cargar();
  }

  createUsuario(): void {
    this.router.navigate(['/admin/usuarios/crear']);
  }

  editUsuario(id: number): void {
    this.router.navigate([`/admin/usuarios/editar/${id}`]);
  }

  deleteUsuario(usuario: Usuario): void {
    const nombre = [usuario.nombre, usuario.apepat, usuario.apemat].filter(Boolean).join(' ');
    this.eliminar(`al usuario "${nombre}"`, this.usuarioService.deleteUsuario(usuario.id!));
  }

  etiquetaRol(rol: string | undefined): string {
    if (rol === 'ADMINISTRADOR') return 'Administrador';
    if (rol === 'PROFESOR') return 'Profesor';
    return '—';
  }
}
