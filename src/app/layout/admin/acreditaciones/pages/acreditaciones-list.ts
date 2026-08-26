import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProcesoAcreditacionResponse } from '../../../../core/models/procesoAcreditacion.model';
import { ProcesoAcreditacionService } from '../../../../core/services/proceso-acreditacion.service';
import { ListaBase } from '../../../../shared/lista-base';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-acreditaciones-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent],
  templateUrl: './acreditaciones-list.html',
  styleUrl: './acreditaciones-list.css',
})
export class AcreditacionesList extends ListaBase<ProcesoAcreditacionResponse> implements OnInit {
  private readonly service = inject(ProcesoAcreditacionService);
  private readonly router = inject(Router);

  protected override get entidad(): string {
    return 'procesos de acreditación';
  }

  protected override consultar(): Observable<ProcesoAcreditacionResponse[]> {
    return this.service.findAll();
  }

  ngOnInit(): void {
    this.cargar();
  }

  create(): void {
    this.router.navigate(['/admin/acreditaciones/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/acreditaciones/editar/${id}`]);
  }

  remove(id: number, descripcion: string): void {
    this.eliminar(`el proceso de acreditación "${descripcion}"`, this.service.delete(id));
  }

  etiquetaEstado(estado: string): string {
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
