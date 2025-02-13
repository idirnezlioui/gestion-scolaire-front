import { Component, OnInit } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { StudentService } from '../../service/student.service';
import { StudentPaimentComponent } from '../student-paiment/student-paiment.component';

@Component({
  selector: 'app-student-list',
  imports: [NavbarComponent , CommonModule,StudentPaimentComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {

  //liste des etudiant
  etudinats:Etudiant[]=[]
  constructor(private etudiantService :StudentService){}
  ngOnInit(): void {
    this.etudiantService.getEtudiants().subscribe((data:Etudiant[])=>{
      this.etudinats=data
      console.log(this.etudinats)
    })
  }

  //selectionne un etudiant 
  etudiantSelection:Etudiant|null=null //initialisation a null

  ouvrirePaiment(etudiant:Etudiant){
    this.etudiantSelection=etudiant
    console.log('Étudiant sélectionné:', this.etudiantSelection)
  }

  //mis a jour de l'etat du paiment

  majPaiment(paimenetreussie:boolean){
    if (paimenetreussie) {
      alert("paiment enregistre avec Succee")
      //reinitialise apres le paiment 
      this.etudiantSelection=null
    }
  }
  fermerPaiment(){
    this.etudiantSelection=null

  }
}
