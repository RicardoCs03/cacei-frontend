import { inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmacionService } from './confirmacion/confirmacion.service';
import { mensajeDeError } from '../core/interceptors/error-interceptor';

/**
 * Comportamiento común de las pantallas de listado.
 *
 * Reúne los tres estados que antes no existían —cargando, error y vacío— y el
 * borrado con confirmación, de modo que cada listado solo tenga que declarar
 * qué consulta y cómo se llama lo que muestra.
 */
export abstract class ListaBase<T> {
  readonly datos = signal<T[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  protected readonly confirmacion = inject(ConfirmacionService);

  /** Consulta que alimenta el listado. */
  protected abstract consultar(): Observable<T[]>;

  /** Nombre de lo que se lista, en singular, para los mensajes al usuario. */
  protected abstract get entidad(): string;

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.consultar().subscribe({
      next: (datos) => {
        this.datos.set(datos ?? []);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(mensajeDeError(err));
        this.cargando.set(false);
      },
    });
  }

  /** true mientras no haya nada que pintar en la tabla. */
  get sinContenido(): boolean {
    return this.cargando() || !!this.error() || this.datos().length === 0;
  }

  get mensajeVacio(): string {
    return `Aún no hay ${this.entidad} registrados.`;
  }

  /**
   * Pide confirmación y, si se acepta, ejecuta el borrado y recarga la lista.
   *
   * @param descripcion cómo identificar el registro en el mensaje
   * @param borrado     petición que elimina el registro
   */
  protected async eliminar(descripcion: string, borrado: Observable<unknown>): Promise<void> {
    const confirmado = await this.confirmacion.preguntar({
      titulo: 'Confirmar eliminación',
      mensaje: `Se eliminará ${descripcion}. Esta acción no se puede deshacer.`,
      etiquetaConfirmar: 'Eliminar',
      destructiva: true,
    });

    if (!confirmado) {
      return;
    }

    borrado.subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(mensajeDeError(err)),
    });
  }
}
