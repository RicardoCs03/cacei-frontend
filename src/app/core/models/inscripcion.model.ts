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
/** Renglon de la lista de alumnos inscritos a un curso. */
export interface InscripcionDetalleDTO {
  /** Identificador de la inscripcion, no del alumno. */
  id: number;
  idAlumno: number;
  matricula: string;
  nombreCompleto: string;
  tipoInscripcion: string | null;
  calificacion: number | null;
}

/** Alumno que puede inscribirse a un curso. */
export interface AlumnoElegible {
  id: number;
  matricula: string;
  nombreCompleto: string;
}

export interface InscribirAlumnoRequest {
  idAlumno: number;
  tipoInscripcion: string;
  calificacion?: number | null;
}

export interface ActualizarCalificacionRequest {
  calificacion: number | null;
  tipoInscripcion?: string;
}