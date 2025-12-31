import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  
  private API_URL = 'http://localhost:9090/api/usuarios';

  constructor(private http: HttpClient) {

  }

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  findByIdorEmail(parametro:string): Observable<Usuario> {
    //Falta agregar el requestParam donde se envia el parametro
    if (!isNaN(Number(parametro))) {
      let id = Number(parametro);
      console.log("DEBUG: Es un ID");
      return this.http.get<Usuario>(`${this.API_URL}/buscar`, {params: {id}});
    }
    return this.http.get<Usuario>(`${this.API_URL}/buscar`, {params: {email: parametro}});
    
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/registrar-usuario`, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.API_URL}/actualizar-usuario/${id}`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/eliminar-usuario/${id}`);
  }

}