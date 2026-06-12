import { Alumno } from "./alumno.model";

export interface Inscripcion {
  id?: number;
  idAlumno?: number;
  idCurso?: number;
  tipoInscripcion: string;
  fecInscripcion: string;
  calificacion?: number | null;
  isActive: boolean;
}

export interface InscripcionResponse {
  id: number;
  idAlumno: number;
  idCurso: number;
  nombreCompletoAlumno: string;
  nombreEE: string;
  nrcCurso: string;
  tipoInscripcion: string;
  fecInscripcion: string;
  calificacion: number | null;
  isActive: boolean;
  mensaje?: string;
}
export interface InscripcionDetalleDTO {
  id: number;
  calificacion: number | null;
  alumno: Alumno;
}