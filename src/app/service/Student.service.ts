import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etudiant } from '../models/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  //recupre url de mon backend 

  private url="http://localhost:3000/api/etudiants"

  constructor(private http:HttpClient) { }

  getEtudiants():Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.url)
  }

}
