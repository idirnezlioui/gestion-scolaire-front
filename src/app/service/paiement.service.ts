import { paiements } from './../models/paiment.model';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  constructor() { }

  ajouterPaiment(paiement:paiements):Observable<paiements>{
    console.log("paiment enregistre ",paiement)
    return of(paiement)
  }
}
