export interface CoordinadorCaceiResponse {
  id: number;
  coordinadorCaceiNombre: string;
  coordinadorCaceiApellidoPaterno: string;
  coordinadorCaceiApellidoMaterno: string;
  programaEducativoNombre: string;
  fechaInicio: string;
  fechaFin: string;
  isActive: boolean;
  mensaje?: string;
}
