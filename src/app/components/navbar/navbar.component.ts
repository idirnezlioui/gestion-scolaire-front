import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';




@Component({
  selector: 'app-navbar',
  imports: [RouterModule,MatButtonModule,MatMenuModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  optionsEtudiants=[
    {label:"Etudiant insecrit",link:"/students/form"},
    {label:"Etudiant en attente",link:"/students"},
    {label:"Ajouter etudiant",link:"/students/form"},
    {label:"Modification",link:"/"}]
  selectedOption=this.optionsEtudiants[0].link

  constructor(private router:Router){}
  navigaTo(link:string){
    this.router.navigate([link])

  }

  optionsEnsignant=[
    {label:"Ajouter Enseignant",link:"/"},
    {label:"Ajout un Enseignant",link:"/"},
    {label:"Modifier un Enseignant",link:"/"},
  ]

  optionPaiment=[
    {label :"consulter etat de paiment",link:"/"},
    {label:"Effectuer un paimenet",link:"/sutudent/paiment"},
    {label:"Modifier un paiment ",link:"/"}
  ]
  optionDocuments=[
    {label:"Imprimer un reçu de paimment",link:"/"},
    {label:"Imprimer le certificat de scolarite",link:"/"},
    {label:"Imprimer l'attestation d'insecription",link:"/"}
  ]
  
  optionApropos=[
    {label:"Paramètres",link:"/"}
  ]

  selectedOptionEt=this.optionsEtudiants[0].link
  selectedOptionEs=this.optionsEtudiants[0].link
  selectedOptionPm=this.optionPaiment[0].link
  selectedOptionDc=this.optionDocuments[0].link
  seletedOptionAP=this.optionApropos[0].link
}
