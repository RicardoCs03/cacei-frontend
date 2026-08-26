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
    active: boolean;

}