import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Catalogo de tipos de inscripcion (ordinaria, extraordinaria, recursamiento...). */
@Injectable({ providedIn: 'root' })
export class TipoInscripcionService {
  private readonly API_URL = `${environment.apiUrl}/tipos-inscripciones`;
  private readonly http = inject(HttpClient);

  findAll(): Observable<string[]> {
    return this.http.get<string[]>(this.API_URL);
  }
}
