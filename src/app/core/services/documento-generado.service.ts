import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentoGeneradoResponse } from '../models/documentoGenerado.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentoGeneradoService {
  API_URL = `${environment.apiUrl}/documentos-generados`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<DocumentoGeneradoResponse[]> {
    return this.http.get<DocumentoGeneradoResponse[]>(`${this.API_URL}/`);
  }
}
