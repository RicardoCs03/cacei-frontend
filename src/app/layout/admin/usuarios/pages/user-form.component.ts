import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { mensajeDeError } from '../../../../core/interceptors/error-interceptor';


@Component({
  selector: 'app-user-form.component',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {

  user:Usuario = {
    email: '',
    password: '',
    isActive: true,
    nombre: '',
    apepat: '',
    apemat: '',
    celular: '',
    fecnac: '',
    genero: '',
    rol: ''
  };

  isEdit = false;

  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private userService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute) { 

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    if (!id) {
      this.cargando.set(false);
      return;
    }

    this.userService.findByIdorEmail(id).subscribe({
      next: (user) => {
        this.user = { ...this.user, ...user };
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  saveUser(): void {
    if (this.isEdit && this.user.id) {
      this.userService.updateUsuario(this.user.id, this.user).subscribe(() => {
        this.router.navigate(['/admin/usuarios']);
      });
    } else {
      this.userService.createUsuario(this.user).subscribe(() => {
        this.router.navigate(['/admin/usuarios']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/usuarios']);
  }

}  