import { Component } from '@angular/core';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario.model';
import { Router, RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list.component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {

  users:Usuario[] = [];

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usuarioService.findAll().subscribe(
      (data: Usuario[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  createUsuario(): void {
    this.router.navigate(['/admin/usuarios/crear']);
  }

  editUsuario(id: number): void {
    this.router.navigate([`/admin/usuarios/editar/${id}`]);
  }

  deleteUsuario(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.deleteUsuario(id).subscribe(
        () => {
          this.users = this.users.filter(user => user.id !== id);
          this.loadUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

}
