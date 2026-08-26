import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { ListaBase } from '../../../../shared/lista-base';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent],
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
