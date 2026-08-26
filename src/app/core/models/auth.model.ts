/** Roles del sistema, con el mismo nombre que tienen en la tabla Roles. */
export type Rol = 'ADMINISTRADOR' | 'PROFESOR';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    role: Rol;
    nombre: string;
    expiraEnSegundos: number;
}
