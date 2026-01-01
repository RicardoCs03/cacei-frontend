import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Curso } from '../../../../core/models/cursos.model';
import { CursoService } from '../../../../core/services/curso.service';

@Component({
  selector: 'app-cursos-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './cursos-list.html',
  styleUrl: './cursos-list.css',
})
export class CursosList implements OnInit {

 cursos: Curso[] = [];

  constructor(
    private service: CursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.findAll().subscribe(data => {
      this.cursos = data;
    });
  }

  create(): void {
    this.router.navigate(['/admin/cursos/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/cursos/editar/${id}`]);
  }

  remove(id: number): void {
    this.service.delete(id).subscribe(() => this.load());
  }

}
