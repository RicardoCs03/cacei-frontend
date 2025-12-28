import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  
  private API_URL = 'https://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {

  }

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  findByIdorEmail(parametro:string): Observable<Usuario> {
    //Falta agregar el requestParam donde se envia el parametro
    return this.http.get<Usuario>(`${this.API_URL}/buscar`, {params: {parametro}});
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/registrar-usuario`, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.API_URL}/${id}/actualizar-usuario`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/eliminar-usuario/${id}`);
  }

}