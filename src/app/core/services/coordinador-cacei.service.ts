import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoordinadorCaceiResponse } from '../models/coordinadorCacei.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoordinadorCaceiService {

  API_URL = `${environment.apiUrl}/coordinadores-cacei`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<CoordinadorCaceiResponse[]> {
    return this.http.get<CoordinadorCaceiResponse[]>(`${this.API_URL}/`);
  }
}
