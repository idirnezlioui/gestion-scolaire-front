import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { StudentFicheComponent } from "../student-fiche/student-fiche.component";

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [MatButtonModule, NavbarComponent, ReactiveFormsModule, StudentFicheComponent],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})

export class StudentFormComponent {

  private fb=inject(FormBuilder)// au lieu de faire a chaque fois new 
  
  //declare la formGroupe pour gére toutes les input du formulaire 
  formGroup=this.fb.group({
    name: ["",[Validators.required]], // Création du FormControl
    prenom: ["",[Validators.required]],
    nationalite: ["",[Validators.required]],
    niveau: ["",[Validators.required]],
    sigle_specia: ["",[Validators.required]],
    id_session:[0,[Validators.required,Validators.min(1),Validators.max(20)]],
    lieu_naiss: ["",[Validators.required]],
    date_inse: ["",[Validators.required]],
    date_naiss:["",[Validators.required]],
    image:["",[Validators.required]],

  })
  /*num_etudiant: number;
  nom: string;
  prenom: string;
  date_naiss: string;
  lieu_naiss: string;
  nationalite: string;
  niveau: string;
  date_inse: string;
  sigle_specia: string;
  id_session: number; */
  

  submit(event: Event) {
    event.preventDefault();
   console.log(this.formGroup.value)
  }

  verificationChamp(name:string){
    const formControl =this.formGroup.get(name)
    return formControl?.invalid && (formControl?.dirty || formControl?.touched )

  }

  nationalite:string[]=[
    "Française",
    "Marocaine",
    "Algérienne",
    "Tunisienne",
    "Sénégalaise",
    "Ivoirienne",
    "Canadienne",
    "Américaine",
    "Espagnole",
    "Italienne"
  ]
  niveaux:string[]=[
    "BAC+1",
    "BAC+2",
    "BAC+3",
    "BAC+4",
    "BAC+5",
  ]
  specialites:string[]=[
    "commerce",
    "big data",
    "develloppement",
    "management"

  ]
  sessions:string[]=[
    "Octobre",
    "Féverier"
  ]

  Onfilehange(event:any){
    const reader=new FileReader()
    if(event.target.files && event.target.files.length){
      const[file]=event.target.files
      reader.readAsDataURL(file)
      reader.onload=()=>{
        this.formGroup.patchValue({
          image: reader.result as string
        })
      }
    }
  }
}
