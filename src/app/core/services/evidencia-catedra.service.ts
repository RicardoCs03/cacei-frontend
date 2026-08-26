import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EvidenciaCatedraService {

  private API_URL = `${environment.apiUrl}/exportar-pdf`;

  constructor(private http: HttpClient) {}

  descargarPdf(cursoId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/evidencias/${cursoId}/pdf`, {
      responseType: 'blob',
    });
  }
}
