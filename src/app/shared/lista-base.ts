import { computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmacionService } from './confirmacion/confirmacion.service';
import { DefinicionFiltro, RangoFiltro } from './filtros/filtro.model';
import { mensajeDeError } from '../core/interceptors/error-interceptor';

/**
 * Comportamiento común de las pantallas de listado.
 *
 * Reúne los tres estados que la interfaz debe distinguir —cargando, error y
 * vacío—, el borrado con confirmación y el filtrado de la lista.
 *
 * El filtrado ocurre en el cliente sobre los datos ya cargados. Es adecuado
 * mientras los listados quepan en una sola respuesta; cuando alguno crezca lo
 * suficiente habrá que paginar y filtrar en el servidor.
 */
export abstract class ListaBase<T> {
  readonly datos = signal<T[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  protected readonly confirmacion = inject(ConfirmacionService);

  // ------------------------------------------------------------------ filtros

  /** Filtros de la pantalla. Sin redefinir, el listado no ofrece filtrado. */
  get filtros(): DefinicionFiltro<T>[] {
    return [];
  }

  readonly valoresTexto = signal<Record<string, string>>({});
  readonly valoresRango = signal<Record<string, RangoFiltro>>({});

  /** Hay al menos un filtro con valor. */
  readonly filtroActivo = computed(() => {
    const textos = this.valoresTexto();
    const rangos = this.valoresRango();
    return (
      Object.values(textos).some((v) => (v ?? '').trim() !== '') ||
      Object.values(rangos).some((r) => r?.min !== null || r?.max !== null)
    );
  });

  /**
   * Opciones de cada filtro de selección.
   *
   * Si la pantalla no las fija, se deducen de los valores presentes en la
   * lista: el desplegable nunca ofrece una opción que daría cero resultados.
   */
  readonly opcionesFiltros = computed<Record<string, string[]>>(() => {
    const resultado: Record<string, string[]> = {};

    for (const filtro of this.filtros) {
      if (filtro.tipo !== 'seleccion') {
        continue;
      }

      if (filtro.opciones) {
        resultado[filtro.clave] = filtro.opciones;
        continue;
      }

      const vistos = new Set<string>();
      for (const item of this.datos()) {
        const valor = filtro.valor(item);
        if (valor !== null && valor !== undefined && String(valor).trim() !== '') {
          vistos.add(String(valor));
        }
      }
      resultado[filtro.clave] = [...vistos].sort((a, b) => a.localeCompare(b, 'es'));
    }

    return resultado;
  });

  /** Lista que se pinta: los filtros con valor se aplican todos a la vez. */
  readonly datosFiltrados = computed(() => {
    if (!this.filtroActivo()) {
      return this.datos();
    }

    const textos = this.valoresTexto();
    const rangos = this.valoresRango();

    return this.datos().filter((item) =>
      this.filtros.every((filtro) => {
        const valor = filtro.valor(item);

        if (filtro.tipo === 'rango') {
          const rango = rangos[filtro.clave];
          if (!rango || (rango.min === null && rango.max === null)) {
            return true;
          }
          // Un registro sin dato no cae dentro de ningún rango.
          if (valor === null || valor === undefined || valor === '') {
            return false;
          }
          const numero = Number(valor);
          if (Number.isNaN(numero)) {
            return false;
          }
          if (rango.min !== null && numero < rango.min) {
            return false;
          }
          return !(rango.max !== null && numero > rango.max);
        }

        const buscado = (textos[filtro.clave] ?? '').trim();
        if (buscado === '') {
          return true;
        }

        const texto = valor === null || valor === undefined ? '' : String(valor);

        return filtro.tipo === 'seleccion'
          ? texto === buscado
          : this.normalizar(texto).includes(this.normalizar(buscado));
      }),
    );
  });

  cambiarFiltroTexto(clave: string, valor: string): void {
    this.valoresTexto.update((actual) => ({ ...actual, [clave]: valor }));
  }

  cambiarFiltroRango(clave: string, extremo: 'min' | 'max', valor: number | null): void {
    this.valoresRango.update((actual) => {
      const rango = actual[clave] ?? { min: null, max: null };
      return { ...actual, [clave]: { ...rango, [extremo]: valor } };
    });
  }

  limpiarFiltros(): void {
    this.valoresTexto.set({});
    this.valoresRango.set({});
  }

  /** Quita acentos y pasa a minúsculas para que «Lucia» encuentre a «Lucía». */
  private normalizar(texto: string): string {
    return (texto ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // ------------------------------------------------------------------ datos

  /** Consulta que alimenta el listado. */
  protected abstract consultar(): Observable<T[]>;

  /** Nombre de lo que se lista, en plural, para los mensajes al usuario. */
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

  /** true mientras no haya nada que pintar, sin contar el efecto de los filtros. */
  get sinContenido(): boolean {
    return this.cargando() || !!this.error() || this.datos().length === 0;
  }

  /** Hay registros, pero ninguno pasa los filtros aplicados. */
  get sinCoincidencias(): boolean {
    return !this.sinContenido && this.datosFiltrados().length === 0;
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
