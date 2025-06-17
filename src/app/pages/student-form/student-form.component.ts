import { StudentService } from './../../service/student.service';
import { SessionService } from './../../service/session.service';
import { Component, inject, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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
import { ToastrService } from 'ngx-toastr';


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
export class StudentFormComponent implements OnInit{
  //stock les infos a temps reel

  etudiantPreview: Partial<Etudiant> = {};

  

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
    type_session: ['', [Validators.required]],
    lieu_naiss: ['', [Validators.required]],
    date_inse: ['', [Validators.required]],
    date_naiss: ['', [Validators.required]],
  });

  constructor(private studentService: StudentService,private toastr:ToastrService, private route: ActivatedRoute) {}

  

  onSubmit(): void {
  if (this.formGroup.invalid) return;

  const formValue = this.formGroup.value;
  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    // mode modification
    this.studentService.updateEtudiant(+id, formValue).subscribe({
      next: () => {
        this.toastr.success("Étudiant modifié avec succès !");
      },
      error: () => {
        this.toastr.error("Erreur lors de la modification");
      }
    });
  } else {
    // mode création
    this.studentService.creatEtudiant(formValue).subscribe({
      next: () => {
        this.toastr.success("Étudiant ajouté avec succès !");
        this.formGroup.reset();
        this.etudiantPreview = {};
      },
      error: () => {
        this.toastr.error("Erreur lors de l'ajout de l'étudiant");
      }
    });
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

  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.studentService.getEtudiantById(+id).subscribe({
  next: (response) => {
    this.formGroup.patchValue(response.etudiant);
    this.etudiantPreview = response.etudiant;
  },
  error: () => {
    this.toastr.error("Erreur lors du chargement de l'étudiant");
  }
});
    }
  });

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


}

