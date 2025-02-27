import { Niveau } from './../models/niveau.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NiveauService {
  private url="http://localhost:3000/api/niveaux"

  constructor(private http:HttpClient) { }

  getNiveau():Observable<Niveau[]>{
    return this.http.get<Niveau[]>(this.url)
  }
}
