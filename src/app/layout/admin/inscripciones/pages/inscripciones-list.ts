import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { InscripcionResponse } from '../../../../core/models/inscripcion.model';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { ListaBase } from '../../../../shared/lista-base';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-inscripciones-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent],
  templateUrl: './inscripciones-list.html',
  styleUrl: './inscripciones-list.css',
})
export class InscripcionesList extends ListaBase<InscripcionResponse> implements OnInit {
  private readonly service = inject(InscripcionService);
  private readonly router = inject(Router);

  protected override get entidad(): string {
    return 'inscripciones';
  }

  protected override consultar(): Observable<InscripcionResponse[]> {
    return this.service.findAll();
  }

  ngOnInit(): void {
    this.cargar();
  }

  create(): void {
    this.router.navigate(['/admin/inscripciones/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/inscripciones/editar/${id}`]);
  }

  remove(id: number, descripcion: string): void {
    this.eliminar(`la inscripción de "${descripcion}"`, this.service.delete(id));
  }
}
