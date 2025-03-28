import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaiementService } from '../../service/paiement.service';
import { StudentService } from '../../service/student.service';
import { paiements } from '../../models/paiment.model';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentRecuComponent } from '../student-recu/student-recu.component';


@Component({
  selector: 'app-student-paiment',
  templateUrl: './student-paiment.component.html',
  styleUrls: ['./student-paiment.component.css'],
  imports:[NavbarComponent,StudentRecuComponent,ReactiveFormsModule]
})
export class StudentPaimentComponent implements OnInit {
  formGroup!: FormGroup;
  etudiants: Etudiant[] = [];
  selectedStudent: Etudiant | null = null;
  showDropdown: boolean = false;
  searchId: string = '';
  searchterm: string = '';
  remiseActive: boolean = true;
  filterEtudiant: Etudiant[] = [];
  tarifformation: number = 0;
  totalPaiements: number = 0;
  paiement: paiements = {
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
      this.filterEtudiant = [...this.etudiants];
    });
  }

  loadTarifFormation() {
    if (this.selectedStudent) {
      this.paiementService.getTarifFormation(this.selectedStudent.num_etudiant??0).subscribe((tarif) => {
        this.tarifformation = tarif.tarif;
        this.updateSolde();
      });
    }
  }

  searchById() {
    if (this.searchId.trim()) {
      this.filterEtudiant = this.etudiants.filter((student) =>
        student.num_etudiant?.toString().includes(this.searchId.trim())
      );
    } else {
      this.filterEtudiant = [...this.etudiants];
    }
    this.toggleDropdown();
  }

  searchByName() {
    if (this.searchterm.trim()) {
      this.filterEtudiant = this.etudiants.filter((student) =>
        `${student.nom?.toLowerCase()} ${student.prenom?.toLowerCase()}`.includes(this.searchterm.toLowerCase())
      );
    } else {
      this.filterEtudiant = [...this.etudiants];
    }
    this.toggleDropdown();
  }

  checkRemise(studentId: number) {
    this.paiementService.verifierRemise(studentId).subscribe((result: boolean) => {
      this.remiseActive = !result;
      console.log('Remise active:', this.remiseActive);
    });
  }

  selectStudent(student: Etudiant) {
    this.selectedStudent = student;
    this.paiement.id_etudiant = student.num_etudiant ?? 0;
    this.paiement.date_paiement = this.formatDate(new Date());
    this.paiement.date_max_paiement = this.formatDate(new Date());
    this.paiement.solde_restant = this.calculateSolde();

    this.loadTarifFormation();
    this.checkRemise(student.num_etudiant ?? 0);

    this.formGroup.patchValue({
      montant_paye: '',
      date_paiement: this.paiement.date_paiement,
      date_max_paiement: '',
      solde_restant: this.paiement.solde_restant,
      remise: '',
      statut_paiment: this.paiement.statut_paiment
    });

    this.showDropdown = false;
  }

  toggleDropdown() {
    this.showDropdown = this.filterEtudiant.length > 0;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  calculateSolde(): number {
    let tarifFormation = this.tarifformation;
    let montantPaye = this.formGroup.get('montant_paye')?.value || 0;
    let remise = this.formGroup.get('remise')?.value || 0;
    return tarifFormation - (montantPaye + remise);
  }

  updateSolde() {
    let soldeRestant = this.calculateSolde();
    this.formGroup.patchValue({ solde_restant: soldeRestant });

    if (soldeRestant <= 0) {
      this.paiement.statut_paiment = 'Payé';
    } else if (this.formGroup.get('montant_paye')?.value > 0) {
      this.paiement.statut_paiment = 'Partiel';
    } else {
      this.paiement.statut_paiment = 'En attente';
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
    let montantPaye = this.formGroup.get('montant_paye')?.value;
    let datePaiement = this.formGroup.get('date_paiement')?.value;
    let dateMaxPaiement = this.formGroup.get('date_max_paiement')?.value;
  
    // Vérification du premier paiement
    if (this.totalPaiements === 0 && montantPaye < 1800) {
      alert('Le premier paiement doit être au moins de 1800€');
      return;
    }
  
    // Vérification de la date max
    if (new Date(dateMaxPaiement) <= new Date(datePaiement)) {
      alert('La date du prochain paiement doit être après la date du paiement');
      return;
    }
  
    // Si le formulaire est invalide (par exemple, montant_paye <= 0 ou ne respecte pas les règles)
    if (this.formGroup.invalid) {
      alert("Veuillez vérifier les champs du formulaire.");
      return;
    }
  
    this.paiement.remise = this.formGroup.get('remise')?.value;
  
    console.log('Données envoyées au backend:', this.paiement);
  
    this.paiementService.ajouterunPaiement(this.paiement).subscribe(
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
    return !!(formControl?.invalid && (formControl?.dirty || formControl?.touched));
  }
}
