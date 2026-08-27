import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { InscripcionResponse } from '../../../../core/models/inscripcion.model';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { ListaBase } from '../../../../shared/lista-base';
import { DefinicionFiltro } from '../../../../shared/filtros/filtro.model';
import { FiltrosComponent } from '../../../../shared/filtros/filtros.component';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-inscripciones-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent, FiltrosComponent],
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

  override get filtros(): DefinicionFiltro<InscripcionResponse>[] {
    return [
      { clave: 'alumno', etiqueta: 'Alumno', tipo: 'texto', ejemplo: 'Nombre del alumno',
        valor: (i) => i.nombreCompletoAlumno },
      { clave: 'ee', etiqueta: 'Experiencia educativa', tipo: 'texto', ejemplo: 'Ej. Redes',
        valor: (i) => i.nombreEE },
      { clave: 'nrc', etiqueta: 'NRC del curso', tipo: 'texto', ejemplo: 'Ej. D101',
        valor: (i) => i.nrcCurso },
      // El tipo de inscripción viene del catálogo TiposInscripciones.
      { clave: 'tipo', etiqueta: 'Tipo de inscripción', tipo: 'seleccion',
        valor: (i) => i.tipoInscripcion },
      { clave: 'calificacion', etiqueta: 'Calificación', tipo: 'rango',
        valor: (i) => i.calificacion },
    ];
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
