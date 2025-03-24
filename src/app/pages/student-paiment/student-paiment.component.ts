import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaiementService } from '../../service/paiement.service';
import { StudentService } from '../../service/student.service';
import { paiements } from '../../models/paiment.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-student-paiment',
  templateUrl: './student-paiment.component.html',
  styleUrl: './student-paiment.component.css',
  imports:[NavbarComponent]
})
export class StudentPaimentComponent implements OnInit {
  formGroup!: FormGroup;
  etudiants: any[] = [];
  selectedStudent: any = null;
  remiseAppliquee: boolean = false;
  showDropdown: boolean = false;

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
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.initForm();
  }

  // Charger tous les étudiants
  loadStudents() {
    this.etudiantService.getEtudiants().subscribe((data) => {
      this.etudiants = data;
    });
  }

  // Recherche par ID
  searchById() {
    this.etudiants = this.etudiants.filter((student) =>
      student.num_etudiant.toString().includes(this.paiment.id_etudiant.toString())
    );
  }

  // Recherche par nom et prénom
  searchByName(searchTerm: string) {
    this.etudiants = this.etudiants.filter((student) =>
      (student.nom + ' ' + student.prenom)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  // Sélection d'un étudiant et remplissage du formulaire
  selectStudent(student: any) {
    console.log("Étudiant sélectionné :", student);

    if (!student || !student.num_etudiant) {
      console.error("ERREUR : L'étudiant sélectionné n'a pas d'ID valide !");
      return;
    }

    this.selectedStudent = student;
    this.paiment.id_etudiant = student.num_etudiant;
    this.paiment.date_paiement = this.formatDate(new Date());
    this.paiment.date_max_paiement = this.formatDate(new Date());
    this.paiment.solde_restant = this.calculateSolde();

    this.formGroup.patchValue({
      montant_paye: '',
      date_paiement: this.paiment.date_paiement,
      date_max_paiement: '',
      solde_restant: this.paiment.solde_restant,
      remise: '',
    });

    this.showDropdown = false;

    // Vérification si une remise a déjà été appliquée
    this.paiementService.verifierRemise(student.num_etudiant).subscribe((remiseExistante) => {
      if (remiseExistante) {
        this.remiseAppliquee = true;
        this.formGroup.get('remise')?.disable();
      }
    });
  }

  // Affichage de la liste
  toggleDropdown() {
    this.showDropdown = true;
  }

  // Formatage de la date
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Calcul du solde restant
  calculateSolde(): number {
    let tarifFormation = 5000;
    let montantPaye = this.formGroup.get('montant_paye')?.value || 0;
    let remise = this.formGroup.get('remise')?.value || 0;
    
    return tarifFormation - (montantPaye + remise);
  }

  // Désactiver la remise après la première saisie
  desactiverRemise() {
    this.remiseAppliquee = true;
  }

  // Initialisation du formulaire avec validation
  private initForm() {
    const fb = inject(FormBuilder);
    this.formGroup = fb.group({
      montant_paye: ['', [Validators.required, Validators.min(1800)]],
      date_paiement: [this.formatDate(new Date()), Validators.required],
      date_max_paiement: ['', Validators.required],
      remise: [{ value: '', disabled: this.remiseAppliquee }],
      solde_restant: [{ value: '', disabled: true }],
    });

    this.formGroup.valueChanges.subscribe(() => this.updateSolde());
  }

  // Mise à jour du solde restant et du statut de paiement
  updateSolde() {
    let soldeRestant = this.calculateSolde();
    this.formGroup.patchValue({ solde_restant: soldeRestant });

    if (soldeRestant <= 0) {
      this.paiment.statut_paiment = "Payé";
    } else if (this.formGroup.get('montant_paye')?.value > 0) {
      this.paiment.statut_paiment = "Partiel";
    } else {
      this.paiment.statut_paiment = "En attente";
    }
  }

  // Valider le paiement
  submitPaiement() {
    if (this.formGroup.invalid) {
      alert("Veuillez remplir correctement le formulaire.");
      return;
    }

    this.paiment.montant_paye = this.formGroup.get('montant_paye')?.value;
    this.paiment.date_paiement = this.formGroup.get('date_paiement')?.value;
    this.paiment.date_max_paiement = this.formGroup.get('date_max_paiement')?.value;
    this.paiment.solde_restant = this.formGroup.get('solde_restant')?.value;
    this.paiment.remise = this.formGroup.get('remise')?.value;

    console.log("Données envoyées au backend:", this.paiment);
    
    this.paiementService.ajouterunPaiement(this.paiment).subscribe(
      (response) => {
        alert('Paiement enregistré avec succès');
        console.log(response);
      },
      (error) => {
        console.error("Erreur lors de l'enregistrement du paiement", error);
        alert("Une erreur est survenue");
      }
    );
  }
}
