import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form.component',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {

  user:Usuario = {
    email: '',
    password: '',
    active: true,
    nombre: '',
    apepat: '',
    apemat: '',
    celular: '',
    fecnac: '',
    genero: '',
    role:''
  };

  isEdit = false;

  constructor(
    private userService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute) { 

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.userService.findByIdorEmail(id).subscribe(user => {
        this.user = user;
      });
    }
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