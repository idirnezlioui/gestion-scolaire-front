import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PaiementService } from '../../service/paiement.service';
import { StudentService } from '../../service/student.service';
import { paiements } from '../../models/paiment.model';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentRecuComponent } from '../student-recu/student-recu.component';

// Validator pour le premier paiement
function premierPaiementValidator(premierPaiement: boolean): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl) => {
    const valeur = control.value;
    if (premierPaiement && valeur < 1800) {
      return { montantPremierPaiement: true };
    }
    if (valeur <= 0) {
      return { min: true };
    }
    return null;
  };
}

// Validator pour la remise
function remiseValidator(isPremier: boolean): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl) => {
    const value = control.value || 0;
    if (!isPremier && value > 0) {
      return { remiseSeulePremiereFois: true };
    }
    if (value < 0) {
      return { remiseNegative: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-student-paiment',
  templateUrl: './student-paiment.component.html',
  styleUrls: ['./student-paiment.component.css'],
  imports: [NavbarComponent, StudentRecuComponent, ReactiveFormsModule],
})
export class StudentPaimentComponent implements OnInit {
  formGroup!: FormGroup;
  etudiants: Etudiant[] = [];
  selectedStudent: Etudiant | null = null;
  showDropdown = false;
  searchId = '';
  searchterm = '';
  remiseActive = true;
  filterEtudiant: Etudiant[] = [];
  tarifformation = 0;
  totalPaiements = 0;
  isPremierPaiement = true;
  soldeInitial = 0;

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
    this.initForm(); // Initial form setup
  }

  loadStudents() {
    this.etudiantService.getEtudiants().subscribe((data) => {
      this.etudiants = data;
      this.filterEtudiant = [...this.etudiants];
    });
  }

  toggleDropdown() {
    this.showDropdown = this.filterEtudiant.length > 0;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
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
    });
  }

  selectStudent(student: Etudiant) {
    this.selectedStudent = student;
    this.paiement.id_etudiant = student.num_etudiant ?? 0;
    this.paiement.date_paiement = this.formatDate(new Date());

    this.checkRemise(student.num_etudiant ?? 0);

    this.paiementService.getTarifFormation(student.num_etudiant ?? 0).subscribe((tarif) => {
      this.tarifformation = tarif.tarif;

      this.paiementService.getPaiementsByEtudiant(this.paiement.id_etudiant).subscribe(paiements => {
        this.isPremierPaiement = paiements.length === 0;

        this.totalPaiements = paiements.reduce((acc, cur) => acc + cur.montant_paye, 0);

        this.soldeInitial = this.isPremierPaiement
          ? this.tarifformation
          : paiements[paiements.length - 1].solde_restant;

        this.paiement.solde_restant = this.soldeInitial;

        this.initForm();

        this.formGroup.patchValue({
          montant_paye: '',
          date_paiement: this.paiement.date_paiement,
          date_max_paiement: '',
          solde_restant: this.paiement.solde_restant,
          remise: '',
          statut_paiment: this.paiement.statut_paiment
        });
      });
    });

    this.showDropdown = false;
  }

  updateSoldeRestant(montant: number) {
    const remise = this.formGroup.get('remise')?.value || 0;
    if (this.isPremierPaiement) {
      this.paiement.solde_restant = this.tarifformation - remise - montant;
    } else {
      this.paiement.solde_restant = this.soldeInitial - montant;
    }
    this.formGroup.get('solde_restant')?.setValue(this.paiement.solde_restant, { emitEvent: false });
  }

  private initForm() {
    this.formGroup = this.fb.group({
      montant_paye: [
        '',
        [
          Validators.required,
          premierPaiementValidator(this.isPremierPaiement)
        ]
      ],
      date_paiement: new FormControl({ value: this.formatDate(new Date()), disabled: true }),
      date_max_paiement: ['', Validators.required],
      remise: ['', remiseValidator(this.isPremierPaiement)],
      solde_restant: [{ value: '', disabled: true }],
      statut_paiment: ['en attente']
    });

    this.formGroup.get('montant_paye')?.valueChanges.subscribe((val: number) => {
      this.updateSoldeRestant(val);
      const soldeRestant=this.paiement.solde_restant
      //verifier si le paiement est comple la date sera la date du système 

      if (val===soldeRestant && soldeRestant>0) {
        const today=this.formatDate(new Date())
        this.formGroup.get('date_max_paiement')?.setValue(today)
      }
    });
  }

  verificationChamp(nom: string): boolean {
    const formControl = this.formGroup.get(nom);
    return !!(formControl?.invalid && (formControl?.dirty || formControl?.touched));
  }

  submitPaiement() {
    const formValues = this.formGroup.getRawValue();

    this.paiement.montant_paye = formValues.montant_paye;
    this.paiement.date_max_paiement = formValues.date_max_paiement;
    this.paiement.remise = formValues.remise;
    this.paiement.solde_restant = this.paiement.solde_restant;

    

    

    if (this.paiement.solde_restant < 0) {
      alert('Le solde restant ne peut pas être négatif.');
      return;
    }

    if (this.isPremierPaiement && this.paiement.montant_paye < 1800) {
      alert('Le premier paiement doit être au moins de 1800€');
      return;
    }

    if (
      this.paiement.montant_paye === this.paiement.solde_restant + this.paiement.montant_paye &&
      !formValues.date_max_paiement
    ) {
      const today = this.formatDate(new Date());
      this.paiement.date_max_paiement = today;
    } else {
      this.paiement.date_max_paiement = formValues.date_max_paiement;
    }

    //  Mise à jour du statut automatiquement
    if (this.paiement.solde_restant <= 0) {
      this.paiement.statut_paiment = 'payé';
    } else if (this.paiement.montant_paye > 0) {
      this.paiement.statut_paiment = 'partiel';
    } else {
      this.paiement.statut_paiment = 'en attente';
    }

    //  Bloquer si tout est déjà payé
    if (this.paiement.statut_paiment === 'payé' && !this.isPremierPaiement) {
      alert("L'étudiant a déjà tout payé. Aucun paiement supplémentaire n’est autorisé.");
      return;
    }

    this.paiementService.ajouterunPaiement(this.paiement).subscribe(
      (response) => {
        alert('Paiement enregistré avec succès');
        console.log(response);
      },
      (error) => {
        console.error("Erreur lors de l'enregistrement du paiement", error);
      alert("Le paiement n'a pas été effectué");
      }
    );
  }
}
