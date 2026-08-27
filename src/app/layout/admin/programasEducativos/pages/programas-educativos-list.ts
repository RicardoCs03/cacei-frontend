import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { ListaBase } from '../../../../shared/lista-base';
import { DefinicionFiltro } from '../../../../shared/filtros/filtro.model';
import { FiltrosComponent } from '../../../../shared/filtros/filtros.component';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-programas-educativos-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent, FiltrosComponent],
  templateUrl: './programas-educativos-list.html',
  styleUrl: './programas-educativos-list.css',
})
export class ProgramaEducativoListComponent extends ListaBase<ProgramaEducativo> implements OnInit {
  private readonly service = inject(ProgramaEducativoService);
  private readonly router = inject(Router);

  protected override get entidad(): string {
    return 'programas educativos';
  }

  protected override consultar(): Observable<ProgramaEducativo[]> {
    return this.service.findAll();
  }

  override get filtros(): DefinicionFiltro<ProgramaEducativo>[] {
    return [
      { clave: 'nombre', etiqueta: 'Nombre del programa', tipo: 'texto', ejemplo: 'Ej. Informatica',
        valor: (p) => p.nombre },
      { clave: 'contraccion', etiqueta: 'Contracción', tipo: 'texto', ejemplo: 'Ej. IINF',
        valor: (p) => p.contraccion },
      // Nivel de estudios y modalidad son catálogos: desplegable.
      { clave: 'nivel', etiqueta: 'Nivel de estudios', tipo: 'seleccion',
        valor: (p) => p.nivelEstudio },
      { clave: 'modalidad', etiqueta: 'Modalidad', tipo: 'seleccion',
        valor: (p) => p.modalidad },
    ];
  }

  ngOnInit(): void {
    this.cargar();
  }

  create(): void {
    this.router.navigate(['/admin/programas-educativos/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/programas-educativos/editar/${id}`]);
  }

  remove(id: number, descripcion: string): void {
    this.eliminar(`el programa educativo "${descripcion}"`, this.service.delete(id));
  }
}
