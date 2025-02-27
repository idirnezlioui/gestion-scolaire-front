import { SessionService } from './../../service/session.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { StudentFicheComponent } from "../student-fiche/student-fiche.component";
import { DomaineService } from '../../service/domaine.service';
import { Domaine } from '../../models/domaine.model';
import { NiveauService } from '../../service/niveau.service';
import { Niveau } from '../../models/niveau.model';
import { Session } from '../../models/session.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [MatButtonModule, NavbarComponent, ReactiveFormsModule, StudentFicheComponent],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})

export class StudentFormComponent {

  private fb=inject(FormBuilder)// au lieu de faire a chaque fois new 

  private domaineService=inject(DomaineService)
  domaines:Domaine[]=[]

  private niveauService=inject(NiveauService)
  niveau:Niveau[]=[]

  private sessionService=inject(SessionService)
  session:Session[]=[]
  
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
 
  
  ngOnInit(): void {
   this.fetchDomaine()
   this.fetchNiveau()
   this.fetchSession()
    
  }

  fetchNiveau(){
    this.niveauService.getNiveau().subscribe({
      next:(data)=>{
        this.niveau=data
      },
      error:(err)=>{
        console.error("Erreur lor de la recuperation des niveaux ",err)
      }
    })
  }

  fetchDomaine(){
    this.domaineService.getDomaine().subscribe({
      next:(data)=>{
        this.domaines=data
      },
      error:(err)=>{
        console.error("Erreure lors de la récuperation des domaines ",err)
      }
    })
  }
  fetchSession(){
    this.sessionService.getSession().subscribe({
      next:(data)=>{
        this.session=data
      },
      error:(err)=>{
        console.error("erreure lors de la récupération des sessions")
      }
    })
  }


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
