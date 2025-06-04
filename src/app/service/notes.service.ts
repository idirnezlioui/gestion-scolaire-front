import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Module } from './../models/module.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private url = 'http://localhost:3000/api/notes';

  constructor(private http: HttpClient) {}

  getModulesByEtudiant(id: number): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.url}/etudiants/${id}/modules`);
  }
}
