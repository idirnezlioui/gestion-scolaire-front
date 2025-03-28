import { paiements } from './../models/paiment.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private url="http://localhost:3000/api/paiement"

  constructor(private http: HttpClient) { }

  ajouterunPaiement(paiement: paiements) {
    console.log("Données envoyées au serveur:", JSON.stringify(paiement, null, 2));
    return this.http.post(`${this.url}/ajouter`, paiement).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'enregistrement du paiement', error);
        return throwError(() => new Error('Une erreur est survenue'));
      })
    );
  }
  

  //recupére tous les paiement

  getPaiements(): Observable<paiements[]> {
    return this.http.get<paiements[]>(this.url);
  }

  // verification remise 
  verifierRemise(idEtudiant: number):Observable<boolean>{
    return this.http.get<boolean>(`${this.url}/verifier-remise/${idEtudiant}`)
  }

  //recupere les tarif de la formation 
  getTarifFormation(idEtudiant: number): Observable<{ tarif: number }> {
    return this.http.get<{ tarif: number }>(`${this.url}/tarif-formation/${idEtudiant}`);
  }
  
}
