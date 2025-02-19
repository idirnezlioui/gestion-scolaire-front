import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-student-paiment',
  imports: [FormsModule, CommonModule, NavbarComponent],
  templateUrl: './student-paiment.component.html',
  styleUrl: './student-paiment.component.css'
})
export class StudentPaimentComponent {
  @Input() etudiant!: Etudiant;
  @Output () paimentEffectue=new EventEmitter<boolean>()


  montant:number=0
  paimentValide=false
  
  ngOnChanges() {
    if (this.etudiant) {
      console.log('Étudiant dans le composant de paiement:', this.etudiant);
    } else {
      console.log('Aucun étudiant sélectionné');
    }
  }

  effectuerPaiment(){
    if (this.montant>0) {
      this.paimentValide=true
      this.paimentEffectue.emit(true)
      alert(`paiment de ${this.montant} € pour ${this.etudiant.nom} effectuer`)
    }else{
      alert("le montant doit etre superieure")
    }
  }
  imprimerRecu(){
    alert(`Reçu de paiment imprimer pour l'etudiant ${this.etudiant.nom} ${this.etudiant.prenom}`)
  }
  imprimerAttestation(){
    alert(`Attestation d'insecription imprimé ${this.etudiant.nom} ${this.etudiant.prenom}`)
  }

  imprimeCertificat(){
    alert(`certificat de scolarite imprimeé ${this.etudiant.nom} ${this.etudiant.prenom}`)
  }

}
