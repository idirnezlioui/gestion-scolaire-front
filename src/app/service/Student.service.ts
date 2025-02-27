import { Etudiant } from './../models/etudiant.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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
  creatEtudiant(etudiant:Etudiant):Observable<Etudiant[]>{
    return this.http.post<any>(this.url,etudiant)

  }

}
