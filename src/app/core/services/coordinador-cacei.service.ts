import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoordinadorCaceiResponse } from '../models/coordinadorCacei.model';

@Injectable({
  providedIn: 'root',
})
export class CoordinadorCaceiService {

  API_URL = 'http://localhost:9090/api/coordinadores-cacei';

  constructor(private http: HttpClient) {}

  findAll(): Observable<CoordinadorCaceiResponse[]> {
    return this.http.get<CoordinadorCaceiResponse[]>(`${this.API_URL}/`);
  }
}
