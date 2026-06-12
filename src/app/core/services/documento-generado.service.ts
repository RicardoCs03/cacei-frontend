import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentoGeneradoResponse } from '../models/documentoGenerado.model';

@Injectable({ providedIn: 'root' })
export class DocumentoGeneradoService {
  API_URL = 'http://localhost:9090/api/documentos-generados';

  constructor(private http: HttpClient) {}

  findAll(): Observable<DocumentoGeneradoResponse[]> {
    return this.http.get<DocumentoGeneradoResponse[]>(`${this.API_URL}/`);
  }
}
