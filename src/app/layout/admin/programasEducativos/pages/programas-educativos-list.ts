import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ProgramaEducativo } from '../../../../core/models/programaEducativo.model';
import { ProgramaEducativoService } from '../../../../core/services/programa-educativo.service';
import { ListaBase } from '../../../../shared/lista-base';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';

@Component({
  selector: 'app-programas-educativos-list',
  standalone: true,
  imports: [RouterModule, EstadoPanelComponent],
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
