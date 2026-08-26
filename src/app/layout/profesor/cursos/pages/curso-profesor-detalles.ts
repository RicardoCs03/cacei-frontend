import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../../../../core/services/curso.service';
import { EvidenciaCatedraService } from '../../../../core/services/evidencia-catedra.service';
import { CursoInscripcionesDTO } from '../../../../core/models/curso.inscripciones.model';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';
import { mensajeDeError } from '../../../../core/interceptors/error-interceptor';

@Component({
  selector: 'app-curso-profesor-detalles',
  standalone: true,
  imports: [EstadoPanelComponent],
  templateUrl: './curso-profesor-detalles.html',
  styleUrl: './curso-profesor-detalles.css',
})
export class CursoProfesorDetalles implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cursoService = inject(CursoService);
  private readonly evidenciaCatedraService = inject(EvidenciaCatedraService);

  readonly detalle = signal<CursoInscripcionesDTO | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  /** Estado del botón de generación de la cédula. */
  readonly generando = signal(false);
  readonly errorPdf = signal<string | null>(null);

  private cursoId!: number;

  ngOnInit(): void {
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.cursoService.getDetalleCurso(this.cursoId).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  get sinContenido(): boolean {
    return this.cargando() || !!this.error() || !this.detalle();
  }

  /** Descarga la Cédula 3.3.2 del curso y la abre en una pestaña nueva. */
  generarCedula(): void {
    if (this.generando()) {
      return;
    }

    this.generando.set(true);
    this.errorPdf.set(null);

    this.evidenciaCatedraService.descargarPdf(this.cursoId).subscribe({
      next: (pdf) => {
        this.generando.set(false);
        const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
        const abierta = window.open(url, '_blank');

        if (!abierta) {
          this.errorPdf.set(
            'El navegador bloqueó la ventana emergente. Permita las ventanas emergentes de este sitio para ver la cédula.',
          );
        }

        // El objeto queda en memoria hasta que se libera; la pestaña ya lo cargó.
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      },
      error: (err) => {
        this.generando.set(false);
        this.errorPdf.set(mensajeDeError(err));
      },
    });
  }
}
