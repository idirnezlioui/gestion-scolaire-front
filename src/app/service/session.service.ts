import { Session } from './../models/session.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private url="http://localhost:3000/api/sessions"

  constructor(private http:HttpClient) { }

  getSession():Observable<Session[]>{
    return this.http.get<Session[]>(this.url)
  }
}
