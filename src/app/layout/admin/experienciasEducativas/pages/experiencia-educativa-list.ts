import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ExperienciaEducativa } from '../../../../core/models/experienciaEducativa.model';
import { ExperienciaEducativaService } from '../../../../core/services/experiencia-educativa-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experiencia-educativa-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './experiencia-educativa-list.html',
  styleUrl: './experiencia-educativa-list.css',
})
export class ExperienciaEducativaList {
  experiencias: ExperienciaEducativa[] = [];

  constructor(private service: ExperienciaEducativaService,private router: Router) {
    console.log('ExperienciaEducativaList constructor');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.findAll().subscribe(data => {
      this.experiencias = data;
    });
  }

  create(): void {
    this.router.navigate(['/admin/experiencias-educativas/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/experiencias-educativas/editar/${id}`]);
  }

  remove(id: number): void {
    this.service.delete(id).subscribe(() => this.load());
  }
}
