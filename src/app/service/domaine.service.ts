import { Domaine } from './../models/domaine.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DomaineService {

  //le lien de mon api
  private url="http://localhost:3000/api/domaines"

  constructor(private http:HttpClient) {}
    getDomaine():Observable<Domaine[]>{
      return this.http.get<Domaine[]>(this.url)
    }

}
