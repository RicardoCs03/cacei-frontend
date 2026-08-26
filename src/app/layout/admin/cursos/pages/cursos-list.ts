import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Curso } from '../../../../core/models/cursos.model';
import { CursoService } from '../../../../core/services/curso.service';
import { ListaBase } from '../../../../shared/lista-base';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-cursos-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent],
  templateUrl: './cursos-list.html',
  styleUrl: './cursos-list.css',
})
export class CursosList extends ListaBase<Curso> implements OnInit {
  private readonly service = inject(CursoService);
  private readonly router = inject(Router);

  protected override get entidad(): string {
    return 'cursos';
  }

  protected override consultar(): Observable<Curso[]> {
    return this.service.findAll();
  }

  ngOnInit(): void {
    this.cargar();
  }

  create(): void {
    this.router.navigate(['/admin/cursos/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/cursos/editar/${id}`]);
  }

  remove(id: number, descripcion: string): void {
    this.eliminar(`el curso "${descripcion}"`, this.service.delete(id));
  }
}
