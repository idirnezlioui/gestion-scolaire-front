import { PaiementService } from './../../service/paiement.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { paiements } from '../../models/paiment.model';
import { StudentService } from '../../service/student.service';
import { StudentRecuComponent } from '../student-recu/student-recu.component';
@Component({
  selector: 'app-student-paiment',
  imports: [FormsModule, CommonModule, NavbarComponent, StudentRecuComponent],
  templateUrl: './student-paiment.component.html',
  styleUrl: './student-paiment.component.css',
})
export class StudentPaimentComponent {
  searchId: string = '';
  searchterm: string = '';
  students: any[] = [];
  filterStudents: any[] = [];
  selectedStudent: any = null;
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
  remiseAppliquee: boolean = false;
  showDropdown: boolean = false;

  constructor(
    private etudiantService: StudentService,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    this.loadStudent();
  }

  //charger tous les étudiants
  loadStudent() {
    this.etudiantService.getEtudiants().subscribe((data) => {
      this.students = data;
    });
  }

  //recherche par id
  searchById() {
    this.filterStudents = this.students.filter((student) =>
      student.num_etudiant.toString().includes(this.searchId)
    );
  }

  //recherche par nom et prenom

  searchByName() {
    this.filterStudents = this.students.filter((student) =>
      (student.nom + ' ' + student.prenom)
        .toLowerCase()
        .includes(this.searchterm.toLowerCase())
    );
  }

  //selection un etudiant et remplire le formulaire
  selectStudent(student: any) {
    this.selectedStudent = student;
    this.paiment.id_etudiant = student.num_etudiant;
    this.paiment.date_paiement = this.formatDate(new Date());
    this.paiment.date_max_paiement = this.formatDate(new Date());
    this.paiment.solde_restant = this.calculateSolde(student);
    this.showDropdown = false;
  }

  //affichage de la liste
  toggleDropdown() {
    this.showDropdown = true;
  }
  //formatage de la date

  formatDate(date: Date) {
    return date.toISOString().split('T')[0];
  }
  //calcul du solde restant
  calculateSolde(student: any) {
    let tarif = 1000;
    return tarif - this.paiment.montant_paye;
  }

  //desactive la remise après la premiere saisie

  desactiverRemise() {
    this.remiseAppliquee = true;
  }

  //valide le paimenet
  submitPaiement() {
    this.paiementService.ajouterPaiment(this.paiment).subscribe((response) => {
      alert('paimenr enregistré avec succèes');
    });
  }
}
