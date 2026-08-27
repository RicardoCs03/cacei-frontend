import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Alumno } from '../../../../core/models/alumno.model';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { ListaBase } from '../../../../shared/lista-base';
import { DefinicionFiltro } from '../../../../shared/filtros/filtro.model';
import { FiltrosComponent } from '../../../../shared/filtros/filtros.component';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-alumnos-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent, FiltrosComponent],
  templateUrl: './alumnos-list.html',
  styleUrl: './alumnos-list.css',
})
export class AlumnosList extends ListaBase<Alumno> implements OnInit {
  private readonly service = inject(AlumnoService);
  private readonly router = inject(Router);

  protected override get entidad(): string {
    return 'alumnos';
  }

  protected override consultar(): Observable<Alumno[]> {
    return this.service.findAll();
  }

  override get filtros(): DefinicionFiltro<Alumno>[] {
    return [
      { clave: 'matricula', etiqueta: 'Matrícula', tipo: 'texto', ejemplo: 'Ej. S22',
        valor: (a) => a.matricula },
      { clave: 'nombre', etiqueta: 'Nombre', tipo: 'texto', ejemplo: 'Nombre o apellidos',
        valor: (a) => `${a.nombre ?? ''} ${a.apepat ?? ''} ${a.apemat ?? ''}` },
      // El programa educativo es una entidad de catálogo: desplegable.
      { clave: 'programa', etiqueta: 'Programa educativo', tipo: 'seleccion',
        valor: (a) => a.programaEducativo },
    ];
  }

  ngOnInit(): void {
    this.cargar();
  }

  create(): void {
    this.router.navigate(['/admin/alumnos/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/alumnos/editar/${id}`]);
  }

  remove(id: number, descripcion: string): void {
    this.eliminar(`al alumno "${descripcion}"`, this.service.delete(id));
  }
}
