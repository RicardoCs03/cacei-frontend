import { Injectable, signal } from '@angular/core';

export interface PeticionConfirmacion {
  titulo: string;
  mensaje: string;
  etiquetaConfirmar?: string;
  /** Marca la acción como destructiva para pintar el botón en rojo. */
  destructiva?: boolean;
}

interface ConfirmacionAbierta extends PeticionConfirmacion {
  resolver: (confirmado: boolean) => void;
}

/**
 * Sustituye al `confirm()` del navegador por un diálogo propio.
 *
 * El diálogo nativo no se puede estilizar, cambia de aspecto en cada sistema
 * operativo y algunos navegadores lo suprimen.
 */
@Injectable({ providedIn: 'root' })
export class ConfirmacionService {
  readonly abierta = signal<ConfirmacionAbierta | null>(null);

  /** Devuelve true si la persona confirma la acción. */
  preguntar(peticion: PeticionConfirmacion): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.abierta.set({ ...peticion, resolver: resolve });
    });
  }

  responder(confirmado: boolean): void {
    const actual = this.abierta();
    if (actual) {
      this.abierta.set(null);
      actual.resolver(confirmado);
    }
  }
}
