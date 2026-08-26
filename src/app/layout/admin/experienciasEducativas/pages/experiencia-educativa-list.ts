import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ExperienciaEducativa } from '../../../../core/models/experienciaEducativa.model';
import { ExperienciaEducativaService } from '../../../../core/services/experiencia-educativa-service';
import { ListaBase } from '../../../../shared/lista-base';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-experiencia-educativa-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent],
  templateUrl: './experiencia-educativa-list.html',
  styleUrl: './experiencia-educativa-list.css',
})
export class ExperienciaEducativaList extends ListaBase<ExperienciaEducativa> implements OnInit {
  private readonly service = inject(ExperienciaEducativaService);
  private readonly router = inject(Router);

  protected override get entidad(): string {
    return 'experiencias educativas';
  }

  protected override consultar(): Observable<ExperienciaEducativa[]> {
    return this.service.findAll();
  }

  ngOnInit(): void {
    this.cargar();
  }

  create(): void {
    this.router.navigate(['/admin/experiencias-educativas/crear']);
  }

  edit(id: number): void {
    this.router.navigate([`/admin/experiencias-educativas/editar/${id}`]);
  }

  remove(id: number, descripcion: string): void {
    this.eliminar(`la experiencia educativa "${descripcion}"`, this.service.delete(id));
  }
}
