import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DefinicionFiltro, RangoFiltro } from './filtro.model';

/**
 * Barra de filtros de un listado.
 *
 * Se arma sola a partir de las definiciones que declara cada pantalla, de modo
 * que los siete paneles de administración se filtran igual y con el mismo
 * aspecto.
 */
@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <h3 class="text-sm font-semibold text-slate-700">Filtrar lista</h3>

        <button
          type="button"
          class="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="!activo()"
          (click)="limpiar.emit()"
        >
          Quitar filtros
        </button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        @for (filtro of definiciones(); track filtro.clave) {
          <div>
            @if (filtro.tipo === 'rango') {
              <span class="form-label">{{ filtro.etiqueta }}</span>
              <div class="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  class="form-input tabular-nums"
                  placeholder="mín."
                  [attr.aria-label]="filtro.etiqueta + ' mínima'"
                  [ngModel]="rangos()[filtro.clave]?.min ?? null"
                  (ngModelChange)="cambiarRango(filtro.clave, 'min', $event)"
                  [name]="filtro.clave + '-min'"
                />
                <span class="text-sm text-slate-500" aria-hidden="true">a</span>
                <input
                  type="number"
                  step="0.1"
                  class="form-input tabular-nums"
                  placeholder="máx."
                  [attr.aria-label]="filtro.etiqueta + ' máxima'"
                  [ngModel]="rangos()[filtro.clave]?.max ?? null"
                  (ngModelChange)="cambiarRango(filtro.clave, 'max', $event)"
                  [name]="filtro.clave + '-max'"
                />
              </div>
            } @else {
              <label [attr.for]="'filtro-' + filtro.clave" class="form-label">
                {{ filtro.etiqueta }}
              </label>

              @if (filtro.tipo === 'seleccion') {
                <select
                  [id]="'filtro-' + filtro.clave"
                  class="form-input"
                  [ngModel]="textos()[filtro.clave] ?? ''"
                  (ngModelChange)="cambiarTexto(filtro.clave, $event)"
                  [name]="filtro.clave"
                >
                  <option value="">Todos</option>
                  @for (opcion of opciones()[filtro.clave] ?? []; track opcion) {
                    <option [value]="opcion">
                      {{ filtro.etiquetaOpcion ? filtro.etiquetaOpcion(opcion) : opcion }}
                    </option>
                  }
                </select>
              } @else {
                <input
                  [id]="'filtro-' + filtro.clave"
                  type="search"
                  class="form-input"
                  [placeholder]="filtro.ejemplo ?? ''"
                  [ngModel]="textos()[filtro.clave] ?? ''"
                  (ngModelChange)="cambiarTexto(filtro.clave, $event)"
                  [name]="filtro.clave"
                />
              }
            }
          </div>
        }
      </div>

      @if (hayRangoActivo()) {
        <p class="text-xs text-slate-500">
          Al filtrar por un rango numérico se ocultan los registros que no tienen ese dato.
        </p>
      }
    </div>
  `,
})
export class FiltrosComponent<T> {
  readonly definiciones = input.required<DefinicionFiltro<T>[]>();
  readonly textos = input.required<Record<string, string>>();
  readonly rangos = input.required<Record<string, RangoFiltro>>();
  readonly opciones = input.required<Record<string, string[]>>();
  readonly activo = input.required<boolean>();

  readonly texto = output<{ clave: string; valor: string }>();
  readonly rango = output<{ clave: string; extremo: 'min' | 'max'; valor: number | null }>();
  readonly limpiar = output<void>();

  cambiarTexto(clave: string, valor: string): void {
    this.texto.emit({ clave, valor });
  }

  cambiarRango(clave: string, extremo: 'min' | 'max', valor: number | null): void {
    this.rango.emit({ clave, extremo, valor });
  }

  hayRangoActivo(): boolean {
    return Object.values(this.rangos()).some((r) => r?.min !== null || r?.max !== null);
  }
}
