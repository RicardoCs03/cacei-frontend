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
    role: 'ROLE_ADMINISTRADOR' | 'ROLE_PROFESOR' | '';
    active: boolean;

}