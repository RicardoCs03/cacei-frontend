import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../core/services/token.service';
import { Router,RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout.component',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {

  role: string | null = '';

  constructor(private tokenService: TokenService,private router: Router){
    this.role = this.tokenService.getRole();
  }

  logout(): void {
    this.tokenService.clear();
    console.log('Usuario deslogueado, token y role eliminados.');
    this.router.navigate(['/login']);
  }


}
