import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { PaiementService } from '../../service/paiement.service';
import { StudentService } from '../../service/student.service';
import { paiements } from '../../models/paiment.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentRecuComponent } from '../student-recu/student-recu.component';
import { Etudiant } from '../../models/etudiant.model';

@Component({
  selector: 'app-student-paiment',
  templateUrl: './student-paiment.component.html',
  styleUrl: './student-paiment.component.css',
  imports:[NavbarComponent,ReactiveFormsModule,StudentRecuComponent]
})
export class StudentPaimentComponent implements OnInit {
  formGroup!: FormGroup;
  etudiants: Etudiant[] = [];
  selectedStudent: Etudiant | null = null;
  showDropdown: boolean = false;
  searchId: string = '';
  searchterm: string = '';
  remiseActive:boolean=true

  filterEtudiant:Etudiant[]=[]

  paiment: paiements = {
    id_paiement: 0,
    montant_paye: 0,
    date_paiement: '',
    date_max_paiement: '',
    solde_restant: 0,
    statut_paiment: 'en attente',
    remise: 0,
    id_etudiant: 0,
  };

  constructor(
    private etudiantService: StudentService,
    private paiementService: PaiementService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.initForm();
  }

  loadStudents() {
    this.etudiantService.getEtudiants().subscribe((data) => {
      this.etudiants = data;
      this.filterEtudiant=[...this.etudiants]
    });
  }

  searchById() {
    if (this.searchId.trim()) {
      this.filterEtudiant = this.etudiants.filter((student) =>
        student.num_etudiant?.toString().includes(this.searchId.trim())
      );
    } else {
      this.filterEtudiant = [...this.etudiants]; // Réinitialiser la liste si le champ est vide
    }
    this.toggleDropdown();
  }
  
  searchByName() {
    if (this.searchterm.trim()) {
      this.filterEtudiant = this.etudiants.filter((student) =>
        `${student.nom?.toLowerCase()} ${student.prenom?.toLowerCase()}`.includes(
          this.searchterm.toLowerCase()
        )
      );
    } else {
      this.filterEtudiant = [...this.etudiants]; // Réinitialiser la liste si le champ est vide
    }
    this.toggleDropdown();
  }
  
  //Fonction pour vérifier si l'étudiant a déjà reçu une remise
  checkRemise(studentId:number){
    this.paiementService.verifierRemise(studentId).subscribe((result:boolean)=>{
      this.remiseActive=!result
      console.log('Remise active:', this.remiseActive);
    })
  }
  

  selectStudent(student: Etudiant) {
    this.selectedStudent = student;
    this.paiment.id_etudiant = student.num_etudiant ??0;
    this.paiment.date_paiement = this.formatDate(new Date());
    this.paiment.date_max_paiement = this.formatDate(new Date());
    this.paiment.solde_restant = this.calculateSolde();

     // Vérifiez la remise uniquement après la sélection de l'étudiant
     this.checkRemise(student.num_etudiant??0);
    this.updateSolde()
    this.formGroup.patchValue({
      montant_paye: '',
      date_paiement: this.paiment.date_paiement,
      date_max_paiement: '',
      solde_restant: this.paiment.solde_restant,
      remise: '',
      statut_paiment:this.paiment
    });

    this.showDropdown = false;
  }

  toggleDropdown() {
    this.showDropdown = this.filterEtudiant.length > 0; // Afficher uniquement s'il y a des résultats
  }
  

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  calculateSolde(): number {
    let tarifFormation = 5000;
    let montantPaye = this.formGroup.get('montant_paye')?.value || 0;
    let remise = this.formGroup.get('remise')?.value || 0;
    return tarifFormation - (montantPaye + remise);
  }

  updateSolde() {
    let soldeRestant = this.calculateSolde();
    this.formGroup.patchValue({ solde_restant: soldeRestant });

    if (soldeRestant <= 0) {
      this.paiment.statut_paiment = 'Payé';
    } else if (this.formGroup.get('montant_paye')?.value > 0) {
      this.paiment.statut_paiment = 'Partiel';
    } else {
      this.paiment.statut_paiment = 'En attente';
    }
  }

  private initForm() {
    this.formGroup = this.fb.group({
      montant_paye: ['', [Validators.required, Validators.min(1800)]],
      date_paiement: [{ value: this.formatDate(new Date()), disabled: true }],
      date_max_paiement: ['', Validators.required],
      remise: [''],
      solde_restant: [{ value: '', disabled: true }],
      statut_paiment: ['en attente'],
    });

    this.formGroup.valueChanges.subscribe(() => this.updateSolde());
  }

  submitPaiement() {
    if (this.formGroup.invalid) {
      alert('Veuillez remplir correctement le formulaire.');
      return;
    }

    this.paiment.montant_paye = this.formGroup.get('montant_paye')?.value;
    this.paiment.date_paiement = this.formGroup.get('date_paiement')?.value;
    this.paiment.date_max_paiement = this.formGroup.get('date_max_paiement')?.value;
    this.paiment.solde_restant = this.formGroup.get('solde_restant')?.value;
    this.paiment.remise = this.formGroup.get('remise')?.value;

    console.log('Données envoyées au backend:', this.paiment);

    this.paiementService.ajouterunPaiement(this.paiment).subscribe(
      (response) => {
        alert('Paiement enregistré avec succès');
        console.log(response);
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement du paiement', error);
        alert('Une erreur est survenue');
      }
    );
  }

  verificationChamp(nom: string): boolean {
    const formControl = this.formGroup.get(nom);
    return !! (formControl?.invalid && (formControl?.dirty || formControl?.touched));
  }
}
