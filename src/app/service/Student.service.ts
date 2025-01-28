import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etudiant } from '../models/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  //declare Lurl du backend
  private baseurl="http://localhost:3000"


  constructor( private http:HttpClient) { }

  //recupere tous les etudiants
  getStudent():Observable<Etudiant[]>{

    return this.http.get<Etudiant[]>(this.baseurl)
  }
}
