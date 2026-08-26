import { Component, input, output } from '@angular/core';

/**
 * Muestra el estado de una consulta cuando no hay datos que pintar: cargando,
 * error o lista vacía.
 *
 * Existe porque antes las tres situaciones se veían igual —una tabla en blanco—
 * y el usuario no podía distinguir "no hay registros" de "el servidor falló".
 */
@Component({
  selector: 'app-estado-panel',
  standalone: true,
  template: `
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-12 text-center">
      @if (cargando()) {
        <div class="flex flex-col items-center gap-3" role="status" aria-live="polite">
          <span
            class="h-8 w-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          ></span>
          <p class="text-sm text-slate-500">Cargando…</p>
        </div>
      } @else if (error()) {
        <div role="alert" class="flex flex-col items-center gap-3">
          <p class="text-sm font-medium text-red-700">{{ error() }}</p>
          <button type="button" class="btn-outline" (click)="reintentar.emit()">
            Reintentar
          </button>
        </div>
      } @else {
        <div class="flex flex-col items-center gap-3">
          <p class="text-sm text-slate-500">{{ mensajeVacio() }}</p>
          @if (accionVacio()) {
            <button type="button" class="btn-primary" (click)="accion.emit()">
              {{ accionVacio() }}
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class EstadoPanelComponent {
  readonly cargando = input(false);
  readonly error = input<string | null>(null);
  readonly mensajeVacio = input('Aún no hay registros.');
  /** Etiqueta del botón de creación; si se omite, no se muestra. */
  readonly accionVacio = input<string | null>(null);

  readonly reintentar = output<void>();
  readonly accion = output<void>();
}
