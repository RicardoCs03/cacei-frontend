import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InscripcionResponse } from '../../../../core/models/inscripcion.model';
import { InscripcionService } from '../../../../core/services/inscripcion.service';

@Component({
  selector: 'app-inscripciones-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './inscripciones-list.html',
  styleUrl: './inscripciones-list.css',
})
export class InscripcionesList implements OnInit {

  inscripciones: InscripcionResponse[] = [];

  constructor(
    private service: InscripcionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.findAll().subscribe(data => this.inscripciones = data);
  }

  create(): void {
    this.router.navigate(['/admin/inscripciones/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/inscripciones/editar/${id}`]);
  }

  remove(id: number, nombreAlumno: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la inscripción de "${nombreAlumno}"?`)) {
      this.service.delete(id).subscribe(() => this.ngOnInit());
    }
  }

}
