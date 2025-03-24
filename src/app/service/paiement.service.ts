import { paiements } from './../models/paiment.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private url="http://localhost:3000/api/paiement"

  constructor(private http: HttpClient) { }

  ajouterunPaiement(paiement:paiements){
    console.log("Données envoyées au serveur :", JSON.stringify(paiement, null, 2));
    return this.http.post(`${this.url}/ajouter`,paiement)
  }

  //recupére tous les paiement

  getPaiements(): Observable<paiements[]> {
    return this.http.get<paiements[]>(this.url);
  }

  // verification remise 
  verifierRemise(idEtudiant: number):Observable<boolean>{
    return this.http.get<boolean>(`${this.url}/verifier-remise/${idEtudiant}`)
  }
}
