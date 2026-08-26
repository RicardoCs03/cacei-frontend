import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { ConfirmacionService } from './confirmacion.service';

/**
 * Diálogo de confirmación de la aplicación. Se monta una sola vez en la raíz y
 * se muestra cuando algún componente llama a {@link ConfirmacionService}.
 */
@Component({
  selector: 'app-confirmacion-dialogo',
  standalone: true,
  template: `
    @if (confirmacion.abierta(); as datos) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
        (click)="responder(false)"
      >
        <div
          class="w-full max-w-md bg-white rounded-xl shadow-xl p-6"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirmacion-titulo"
          aria-describedby="confirmacion-mensaje"
          (click)="$event.stopPropagation()"
          (keydown.escape)="responder(false)"
        >
          <h2 id="confirmacion-titulo" class="text-lg font-semibold text-slate-800">
            {{ datos.titulo }}
          </h2>
          <p id="confirmacion-mensaje" class="mt-2 text-sm text-slate-600">
            {{ datos.mensaje }}
          </p>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="btn-outline" (click)="responder(false)">
              Cancelar
            </button>
            <button
              #botonConfirmar
              type="button"
              [class]="datos.destructiva ? 'btn-delete' : 'btn-primary'"
              (click)="responder(true)"
            >
              {{ datos.etiquetaConfirmar ?? 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmacionDialogoComponent {
  readonly confirmacion = inject(ConfirmacionService);

  private readonly botonConfirmar = viewChild<ElementRef<HTMLButtonElement>>('botonConfirmar');

  constructor() {
    // Al abrirse, el foco pasa al diálogo para poder responder con el teclado.
    effect(() => {
      if (this.confirmacion.abierta()) {
        queueMicrotask(() => this.botonConfirmar()?.nativeElement.focus());
      }
    });
  }

  responder(confirmado: boolean): void {
    this.confirmacion.responder(confirmado);
  }
}
