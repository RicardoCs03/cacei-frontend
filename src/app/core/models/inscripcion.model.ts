export interface Inscripcion {
  id?: number;
  idAlumno?: number;
  idCurso?: number;
  tipoInscripcion: string;
  fecInscripcion: string;
  calificacion?: number | null;
  isActive: boolean;
}
