import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvidenciaCatedraService {

  private API_URL = 'http://localhost:9090/api/exportar-pdf';

  constructor(private http: HttpClient) {}

  descargarPdf(cursoId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/evidencias/${cursoId}/pdf`, {
      responseType: 'blob',
    });
  }
}
