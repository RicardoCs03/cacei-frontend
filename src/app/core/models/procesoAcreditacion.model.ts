export type ProcesoEstado = 'INICIADO' | 'EN_PROGRESO' | 'COMPLETADO' | 'EN_REVISION' | 'CERRADO';

export interface ProcesoAcreditacionRequest {
  programaEducativofk?: number;
  cicloEvaluacion?: string;
  coordinadorCaceifk?: number;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: ProcesoEstado;
}

export interface ProcesoAcreditacionResponse {
  id: number;
  programaEducativoNombre: string;
  cicloEvaluacion: string;
  coordinadorCaceiNombre: string;
  coordinadorCaceiApepallidoPaterno: string;
  coordinadorCaceiApepallidoMaterno: string;
  fechaInicio: string;
  // Un proceso abierto todavía no tiene fecha de cierre.
  fechaFin: string | null;
  estado: ProcesoEstado;
  mensaje?: string;
}
