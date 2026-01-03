export interface Curso {
  id?: number;
  idProfesor?: number;
  idEE?: number;
  fechaAsignacion: string;
  fechaInicio: string;
  fechaFin: string;
  periodo: string;
  horasSemana: number;
  hora: string;
  salon: string;
  isActive?: boolean;
}
export interface CursoDetalleDTO {
  id: number;
  nombre: string;
  programaEducativo: string;
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
}
