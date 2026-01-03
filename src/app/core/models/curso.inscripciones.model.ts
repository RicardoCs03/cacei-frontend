import { CursoDetalleDTO } from './cursos.model';
import { InscripcionDetalleDTO } from './inscripcion.model';
export interface CursoInscripcionesDTO {
  curso: CursoDetalleDTO;
  inscripciones: InscripcionDetalleDTO[];
}