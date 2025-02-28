import { StudentService } from './../../service/student.service';
import { SessionService } from './../../service/session.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentFicheComponent } from '../student-fiche/student-fiche.component';
import { DomaineService } from '../../service/domaine.service';
import { Domaine } from '../../models/domaine.model';
import { NiveauService } from '../../service/niveau.service';
import { Niveau } from '../../models/niveau.model';
import { Session } from '../../models/session.model';
import { Etudiant } from '../../models/etudiant.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [
    MatButtonModule,
    NavbarComponent,
    ReactiveFormsModule,
    StudentFicheComponent,
  ],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css',
})
export class StudentFormComponent {

  //stock les infos a temps reel 

  etudiantPreview:Partial<Etudiant>={}

  


  private fb = inject(FormBuilder); // au lieu de faire a chaque fois new

  private domaineService = inject(DomaineService);
  domaines: Domaine[] = [];

  private niveauService = inject(NiveauService);
  niveau: Niveau[] = [];

  private sessionService = inject(SessionService);
  session: Session[] = [];

  //declare la formGroupe pour gére toutes les input du formulaire
  formGroup = this.fb.group({
    nom: ['', [Validators.required]], // Création du FormControl
    prenom: ['', [Validators.required]],
    nationalite: ['', [Validators.required]],
    niveau: ['', [Validators.required]],
    intitule_domaine: ['', [Validators.required]],
    type_session: ['',[Validators.required]],
    lieu_naiss: ['', [Validators.required]],
    date_inse: ['', [Validators.required]],
    date_naiss: ['', [Validators.required]],
    image: ['', [Validators.required]],
  });

  constructor(private studentService: StudentService) {}

  submit(event: Event) {
    event.preventDefault();

    if (this.formGroup.valid) {
      this.studentService
        .creatEtudiant(this.formGroup.value as Etudiant)
        .subscribe({
          next: (response) => {
            console.log('Etudiant ajoute avec succe', response);
            alert('Etudiant ajoute avec succés');
          },
          error: (err) => {
            console.error("Erreur lors de l'ajout de l'étudiant", err);
            alert("Erreur lors de l'ajout de l'étudiant.");
          },
        });
    } else {
      alert('Veuillez remplir tous les champs correctement.');
    }
  }

  verificationChamp(nom: string) {
    const formControl = this.formGroup.get(nom);
    return formControl?.invalid && (formControl?.dirty || formControl?.touched);
  }

  nationalite: string[] = [
    'Française',
    'Marocaine',
    'Algérienne',
    'Tunisienne',
    'Sénégalaise',
    'Ivoirienne',
    'Canadienne',
    'Américaine',
    'Espagnole',
    'Italienne',
  ];

  ngOnInit(): void {
    this.fetchDomaine();
    this.fetchNiveau();
    this.fetchSession();

     // Écouter les changements du formulaire en temps réel
     this.formGroup.valueChanges.subscribe((values) => {
      this.etudiantPreview = { ...values };
    });
  }

  fetchNiveau() {
    this.niveauService.getNiveau().subscribe({
      next: (data) => {
        this.niveau = data;
      },
      error: (err) => {
        console.error('Erreur lor de la recuperation des niveaux ', err);
      },
    });
  }

  fetchDomaine() {
    this.domaineService.getDomaine().subscribe({
      next: (data) => {
        this.domaines = data;
      },
      error: (err) => {
        console.error('Erreure lors de la récuperation des domaines ', err);
      },
    });
  }
  fetchSession() {
    this.sessionService.getSession().subscribe({
      next: (data) => {
        this.session = data;
      },
      error: (err) => {
        console.error('erreure lors de la récupération des sessions');
      },
    });
  }

  Onfilehange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.formGroup.patchValue({
          image: reader.result as string,
        });
      };
    }
  }
}
