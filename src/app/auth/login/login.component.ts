import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  
  email: string = '';
  password: string = '';
  error: string = '';
  
  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) {
    
  }

  login(): void {
    console.log('Intentando iniciar sesión con', this.email);
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.tokenService.save(response.token, response.role);
        console.log('Login successful, token saved.');
        console.log('User role:', response.role);
        console.log('token:', response.token);
        if(response.role === 'ROLE_ADMINISTRADOR') {
          console.log('Navegando al dashboard de administrador');
          this.router.navigate(['/admin']);
        }
        else if(response.role === 'ROLE_PROFESOR') {
          console.log('Navegando al home de profesor');
          this.router.navigate(['/profesor']);
        }
      },
      error: (err) => {
        this.error = 'Favor de verificar sus credenciales.';
        console.error('Login error:', err);
      }
    });
    
  }

}
