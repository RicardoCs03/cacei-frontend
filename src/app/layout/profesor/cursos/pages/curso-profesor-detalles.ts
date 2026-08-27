import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CursoService } from '../../../../core/services/curso.service';
import { EvidenciaCatedraService } from '../../../../core/services/evidencia-catedra.service';
import { TipoInscripcionService } from '../../../../core/services/tipo-inscripcion.service';
import { CursoInscripcionesDTO } from '../../../../core/models/curso.inscripciones.model';
import { AlumnoElegible, InscripcionDetalleDTO } from '../../../../core/models/inscripcion.model';
import { EstadoPanelComponent } from '../../../../shared/estado-panel/estado-panel.component';
import { ConfirmacionService } from '../../../../shared/confirmacion/confirmacion.service';
import { mensajeDeError } from '../../../../core/interceptors/error-interceptor';

@Component({
  selector: 'app-curso-profesor-detalles',
  standalone: true,
  imports: [FormsModule, EstadoPanelComponent],
  templateUrl: './curso-profesor-detalles.html',
  styleUrl: './curso-profesor-detalles.css',
})
export class CursoProfesorDetalles implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cursoService = inject(CursoService);
  private readonly evidenciaCatedraService = inject(EvidenciaCatedraService);
  private readonly tipoInscripcionService = inject(TipoInscripcionService);
  private readonly confirmacion = inject(ConfirmacionService);

  readonly detalle = signal<CursoInscripcionesDTO | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  /** Mensajes de las acciones sobre el grupo, separados del error de carga. */
  readonly aviso = signal<string | null>(null);
  readonly errorAccion = signal<string | null>(null);

  readonly tipos = signal<string[]>([]);

  // --- filtros de la lista --------------------------------------------------
  // El filtrado es en el cliente: la lista de un curso son unas decenas de
  // alumnos que ya vienen cargadas, asi que responde al instante y evita una
  // consulta por cada tecla.
  readonly filtroMatricula = signal('');
  readonly filtroNombre = signal('');
  readonly filtroTipo = signal('');
  readonly filtroCalifMin = signal<number | null>(null);
  readonly filtroCalifMax = signal<number | null>(null);

  // --- edición de una calificación -----------------------------------------
  readonly editandoId = signal<number | null>(null);
  calificacionEditada: number | null = null;
  tipoEditado = '';
  readonly guardandoFila = signal(false);

  // --- alta de un alumno ----------------------------------------------------
  readonly mostrandoAlta = signal(false);
  readonly elegibles = signal<AlumnoElegible[]>([]);
  readonly cargandoElegibles = signal(false);
  readonly inscribiendo = signal(false);
  alumnoSeleccionado: number | null = null;
  tipoNuevo = '';
  calificacionNueva: number | null = null;

  // --- generación de la cédula ---------------------------------------------
  readonly generando = signal(false);
  readonly errorPdf = signal<string | null>(null);

  private cursoId!: number;

  /** Todos los inscritos del curso, sin filtrar. */
  readonly inscripciones = computed(() => this.detalle()?.inscripciones ?? []);

  /** Hay al menos un filtro con valor. */
  readonly filtroActivo = computed(
    () =>
      this.filtroMatricula().trim() !== '' ||
      this.filtroNombre().trim() !== '' ||
      this.filtroTipo() !== '' ||
      this.filtroCalifMin() !== null ||
      this.filtroCalifMax() !== null,
  );

  /**
   * Lista que se pinta. Los filtros se combinan entre si: un renglon debe
   * cumplir todos los que tengan valor.
   */
  readonly inscripcionesFiltradas = computed(() => {
    if (!this.filtroActivo()) {
      return this.inscripciones();
    }

    const matricula = this.normalizar(this.filtroMatricula());
    const nombre = this.normalizar(this.filtroNombre());
    const tipo = this.filtroTipo();
    const min = this.filtroCalifMin();
    const max = this.filtroCalifMax();

    return this.inscripciones().filter((i) => {
      if (matricula && !this.normalizar(i.matricula).includes(matricula)) {
        return false;
      }

      if (nombre && !this.normalizar(i.nombreCompleto).includes(nombre)) {
        return false;
      }

      if (tipo && i.tipoInscripcion !== tipo) {
        return false;
      }

      if (min !== null || max !== null) {
        // Quien no tiene calificacion no cae dentro de ningun rango.
        if (i.calificacion === null) {
          return false;
        }
        if (min !== null && i.calificacion < min) {
          return false;
        }
        if (max !== null && i.calificacion > max) {
          return false;
        }
      }

      return true;
    });
  });

  limpiarFiltros(): void {
    this.filtroMatricula.set('');
    this.filtroNombre.set('');
    this.filtroTipo.set('');
    this.filtroCalifMin.set(null);
    this.filtroCalifMax.set(null);
  }

  /**
   * Quita acentos y pasa a minusculas para que "Lucia" encuentre a "Lucía".
   */
  private normalizar(texto: string): string {
    return (texto ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  get sinContenido(): boolean {
    return this.cargando() || !!this.error() || !this.detalle();
  }

  ngOnInit(): void {
    this.cursoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargar();
    this.tipoInscripcionService.findAll().subscribe({
      next: (tipos) => {
        this.tipos.set(tipos);
        this.tipoNuevo = tipos[0] ?? '';
      },
      // El catálogo no es crítico: si falla, el resto de la pantalla sigue sirviendo.
      error: () => this.tipos.set([]),
    });
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

  // ------------------------------------------------------ editar calificación

  editar(inscripcion: InscripcionDetalleDTO): void {
    this.limpiarMensajes();
    this.editandoId.set(inscripcion.id);
    this.calificacionEditada = inscripcion.calificacion;
    this.tipoEditado = inscripcion.tipoInscripcion ?? '';
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  guardarCalificacion(inscripcion: InscripcionDetalleDTO): void {
    if (this.guardandoFila()) {
      return;
    }

    if (!this.calificacionValida(this.calificacionEditada)) {
      this.errorAccion.set('La calificación debe estar entre 0 y 10.');
      return;
    }

    this.guardandoFila.set(true);
    this.limpiarMensajes();

    this.cursoService
      .actualizarCalificacion(this.cursoId, inscripcion.id, {
        calificacion: this.calificacionEditada,
        tipoInscripcion: this.tipoEditado || undefined,
      })
      .subscribe({
        next: (actualizada) => {
          this.guardandoFila.set(false);
          this.editandoId.set(null);
          this.reemplazarFila(actualizada);
          this.aviso.set(`Se guardó la calificación de ${actualizada.nombreCompleto}.`);
        },
        error: (err) => {
          this.guardandoFila.set(false);
          this.errorAccion.set(mensajeDeError(err));
        },
      });
  }

  // --------------------------------------------------------- inscribir alumno

  abrirAlta(): void {
    this.limpiarMensajes();
    this.mostrandoAlta.set(true);
    this.alumnoSeleccionado = null;
    this.calificacionNueva = null;
    this.cargandoElegibles.set(true);

    this.cursoService.alumnosElegibles(this.cursoId).subscribe({
      next: (alumnos) => {
        this.elegibles.set(alumnos);
        this.cargandoElegibles.set(false);
      },
      error: (err) => {
        this.cargandoElegibles.set(false);
        this.errorAccion.set(mensajeDeError(err));
      },
    });
  }

  cerrarAlta(): void {
    this.mostrandoAlta.set(false);
  }

  inscribir(): void {
    if (this.inscribiendo() || !this.alumnoSeleccionado) {
      return;
    }

    if (!this.calificacionValida(this.calificacionNueva)) {
      this.errorAccion.set('La calificación debe estar entre 0 y 10.');
      return;
    }

    this.inscribiendo.set(true);
    this.limpiarMensajes();

    this.cursoService
      .inscribirAlumno(this.cursoId, {
        idAlumno: this.alumnoSeleccionado,
        tipoInscripcion: this.tipoNuevo,
        calificacion: this.calificacionNueva,
      })
      .subscribe({
        next: (nueva) => {
          this.inscribiendo.set(false);
          this.mostrandoAlta.set(false);
          this.aviso.set(`${nueva.nombreCompleto} quedó inscrito en el curso.`);
          // Se recarga para que la lista respete el orden por apellido.
          this.cargar();
        },
        error: (err) => {
          this.inscribiendo.set(false);
          this.errorAccion.set(mensajeDeError(err));
        },
      });
  }

  // -------------------------------------------------------------- dar de baja

  async darDeBaja(inscripcion: InscripcionDetalleDTO): Promise<void> {
    const confirmado = await this.confirmacion.preguntar({
      titulo: 'Dar de baja del curso',
      mensaje: `Se dará de baja a ${inscripcion.nombreCompleto}. El registro se conserva en el historial y podrá volver a inscribirse.`,
      etiquetaConfirmar: 'Dar de baja',
      destructiva: true,
    });

    if (!confirmado) {
      return;
    }

    this.limpiarMensajes();

    this.cursoService.darDeBaja(this.cursoId, inscripcion.id).subscribe({
      next: () => {
        this.aviso.set(`${inscripcion.nombreCompleto} fue dado de baja del curso.`);
        this.cargar();
      },
      error: (err) => this.errorAccion.set(mensajeDeError(err)),
    });
  }

  // ------------------------------------------------------------------ cédula

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

        if (!window.open(url, '_blank')) {
          this.errorPdf.set(
            'El navegador bloqueó la ventana emergente. Permita las ventanas emergentes de este sitio para ver la cédula.',
          );
        }

        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      },
      error: (err) => {
        this.generando.set(false);
        this.errorPdf.set(mensajeDeError(err));
      },
    });
  }

  // ------------------------------------------------------------------- apoyo

  private calificacionValida(valor: number | null): boolean {
    return valor === null || (valor >= 0 && valor <= 10);
  }

  private reemplazarFila(actualizada: InscripcionDetalleDTO): void {
    const actual = this.detalle();
    if (!actual) {
      return;
    }

    this.detalle.set({
      ...actual,
      inscripciones: actual.inscripciones.map((i) => (i.id === actualizada.id ? actualizada : i)),
    });
  }

  private limpiarMensajes(): void {
    this.aviso.set(null);
    this.errorAccion.set(null);
  }
}
