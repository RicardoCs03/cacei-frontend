import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  private token = 'token';
  private role = 'role';

  //Método para guardar el token y el rol en el almacenamiento local
  save(token: string, role: string): void {
    localStorage.setItem(this.token, token);
    localStorage.setItem(this.role, role);
  }
  
  //Método para obtener el token del almacenamiento local
  getToken(): string | null {
    return localStorage.getItem(this.token);
  }

  //Método para obtener el rol del almacenamiento local
  getRole(): string | null {
    return localStorage.getItem(this.role);
  } 

  //Método para verificar si el usuario está autenticado
  isLogged(): boolean {
    return !!this.getToken();
  }

  //Método para limpiar el almacenamiento local
  clear(): void {
    localStorage.clear();
  }


}
