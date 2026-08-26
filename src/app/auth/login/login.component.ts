import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';

  readonly error = signal('');
  readonly enviando = signal(false);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  login(): void {
    if (this.enviando()) {
      return;
    }

    this.error.set('');
    this.enviando.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (respuesta) => {
        this.enviando.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl ?? this.authService.rutaInicio(respuesta.role));
      },
      error: (err: HttpErrorResponse) => {
        this.enviando.set(false);
        this.error.set(
          err.status === 0
            ? 'No se pudo contactar al servidor. Verifique su conexión e intente de nuevo.'
            : 'Correo o contraseña incorrectos.',
        );
      },
    });
  }
}
