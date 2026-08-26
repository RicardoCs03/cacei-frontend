import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Curso } from '../../../../core/models/cursos.model';
import { CursoService } from '../../../../core/services/curso.service';
import { ListaBase } from '../../../../shared/lista-base';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-cursos-profesor',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent],
  templateUrl: './cursos-profesor.html',
  styleUrl: './cursos-profesor.css',
})
export class CursosProfesor extends ListaBase<Curso> implements OnInit {
  private readonly cursoService = inject(CursoService);

  protected override get entidad(): string {
    return 'cursos';
  }

  protected override consultar(): Observable<Curso[]> {
    return this.cursoService.findByProfesor();
  }

  override get mensajeVacio(): string {
    return 'No tiene cursos asignados por el momento.';
  }

  ngOnInit(): void {
    this.cargar();
  }
}
