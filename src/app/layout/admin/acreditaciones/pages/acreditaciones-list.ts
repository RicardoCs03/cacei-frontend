import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProcesoAcreditacionResponse } from '../../../../core/models/procesoAcreditacion.model';
import { ProcesoAcreditacionService } from '../../../../core/services/proceso-acreditacion.service';

@Component({
  selector: 'app-acreditaciones-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './acreditaciones-list.html',
  styleUrl: './acreditaciones-list.css',
})
export class AcreditacionesList implements OnInit {

  procesos: ProcesoAcreditacionResponse[] = [];

  constructor(
    private service: ProcesoAcreditacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.findAll().subscribe(data => this.procesos = data);
  }

  create(): void {
    this.router.navigate(['/admin/acreditaciones/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/acreditaciones/editar/${id}`]);
  }

  remove(id: number, nombreProceso: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el proceso de acreditación "${nombreProceso}"?`)) {
      this.service.delete(id).subscribe(() => this.ngOnInit());
    }
  }

  estadoLabel(estado: string): string {
    switch (estado) {
      case 'INICIADO': return 'Iniciado';
      case 'EN_PROGRESO': return 'En progreso';
      case 'COMPLETADO': return 'Completado';
      case 'EN_REVISION': return 'En revisión';
      case 'CERRADO': return 'Cerrado';
      default: return estado;
    }
  }
}
