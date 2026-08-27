import { Rol } from './auth.model';

export interface Usuario{
    id?: number;
    email: string;
    password: string;
    fecnac: string;
    genero: string;
    celular: string;
    nombre: string;
    apepat: string;
    apemat: string;
    rol: Rol | '';
    isActive?: boolean;

}
/**
 * Profesor tal como lo devuelve GET /api/profesores.
 * `id` es el de DetallesProfesor, que es el que piden los endpoints de cursos.
 */
export interface ProfesorOpcion {
    id: number;
    idUsuario: number;
    nombre: string;
    apepat: string;
    apemat: string;
    matricula: string;
}
