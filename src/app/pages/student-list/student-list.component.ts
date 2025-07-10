import { Component, OnInit } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { StudentService } from '../../service/student.service';
import { Router } from '@angular/router';
import { DomaineService } from '../../service/domaine.service';
import { NiveauService } from '../../service/niveau.service';
import { SessionService } from '../../service/session.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-student-list',
  imports: [NavbarComponent , CommonModule,  FormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  domaines: any[] = [];
  niveaux: any[] = [];
  sessions: any[] = [];
  isProf=false

selectedDomaine: string = '';
selectedNiveau: string = '';
selectedSession: string = '';


allEtudiants: Etudiant[] = []; // Toutes les données reçues

  //liste des etudiant
  etudinats:Etudiant[]=[]
  constructor(private etudiantService :StudentService,private auth:AuthService,private domaineService:DomaineService,private niveauService:NiveauService,private sessionService:SessionService ,private router:Router){}
  ngOnInit(): void {
  this.etudiantService.getEtudiants().subscribe(data => {
    this.allEtudiants = data;
    this.etudinats = [...data];
    this.isProf=this.auth.isProf()
  });

  this.domaineService.getDomaine().subscribe(data => this.domaines = data);
  this.niveauService.getNiveau().subscribe(data => this.niveaux = data);
  this.sessionService.getSession().subscribe(data => this.sessions = data);
}

applyFilters(): void {
  this.etudinats = this.allEtudiants.filter(e => {
    return (!this.selectedDomaine || e.domaine === this.selectedDomaine) &&
           (!this.selectedNiveau || e.niveau === this.selectedNiveau) &&
           (!this.selectedSession || e.type_session === this.selectedSession);
  });
}


  goToPaiement(student: any) {
  this.router.navigate(['/paiement', student.num_etudiant]);
}


editStudent(id:string | null) {
    if (!id) return;
  this.router.navigate(['/students/form', id]); 
}


  imprimerAttestation(student: any) {
  const contenu = `
<html>
  <head>
    <style>
      body {
        font-family: 'Times New Roman', serif;
        margin: 0;
        padding: 0;
        font-size: 15px;
        color: #000;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .container {
        width: 80%;
      }
      .title {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 30px;
        text-decoration: underline;
      }
      .content {
        line-height: 1.8;
      }
      .label {
        font-weight: bold;
      }
      .signature {
        margin-top: 60px;
        text-align: right;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="title">ATTESTATION D’INSCRIPTION</div>

      <div class="content">
        Nous soussignés, <strong>Institut GoldenCollar</strong>, attestons que :<br><br>

        <span class="label">Identifiant :</span> ${student.num_etudiant}<br>
        <span class="label">Nom :</span> ${student.nom}<br>
        <span class="label">Prénom :</span> ${student.prenom}<br>
        <span class="label">Nationalité :</span> ${student.nationalite}<br>
        <span class="label">Spécialité :</span> ${student.domaine || '---'}<br>
        <span class="label">Niveau :</span> ${student.niveau || '---'}<br>
        <span class="label">Session :</span> ${student.type_session || '---'}<br>
        <span class="label">Date d'inscription :</span> ${student.date_inse || '---'}<br><br>

        À la fin de l'année scolaire, si le candidat réussit toutes les évaluations et l'examen final, 
        nous lui délivrerons une attestation de réussite, qui lui permettra de s'inscrire à un niveau supérieur.<br><br>

        Pour servir et faire valoir ce que de droit.
      </div>

      <div class="signature">
        Fait à Paris, le ${new Date().toLocaleDateString()}<br><br>
        <strong>Directeur de l’établissement</strong>
      </div>
    </div>
  </body>
</html>
`;


  const fenetre = window.open('', '_blank');
  if (fenetre) {
    fenetre.document.open();
    fenetre.document.write(contenu);
    fenetre.document.close();
    fenetre.print();
  }
}



imprimerCertificat(student: any) {
  const contenu = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          margin: 0;
          padding: 0;
          font-size: 15px;
          color: #000;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .container {
          width: 80%;
        }

        .title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-decoration: underline;
          margin-bottom: 30px;
        }

        .content {
          line-height: 1.8;
        }

        .label {
          font-weight: bold;
        }

        .signature {
          margin-top: 60px;
          text-align: right;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="title">CERTIFICAT DE SCOLARITÉ</div>

        <div class="content">
          Nous, soussignés, <strong>Institut GoldenCollar</strong>, certifions que :<br><br>

          <span class="label">Identifiant :</span> ${student.num_etudiant}<br>
          <span class="label">Nom :</span> ${student.nom}<br>
          <span class="label">Prénom :</span> ${student.prenom}<br>
          <span class="label">Nationalité :</span> ${student.nationalite}<br>
          <span class="label">Spécialité :</span> ${student.domaine || '---'}<br>
          <span class="label">Niveau :</span> ${student.niveau || '---'}<br>
          <span class="label">Session :</span> ${student.type_session || '---'}<br>
          <span class="label">Date d'inscription :</span> ${student.date_inse || '---'}<br><br>

          L'étudiant(e) susmentionné(e) est inscrit(e) régulièrement au sein de notre établissement pour l’année académique en cours.<br><br>

          Pour servir et faire valoir ce que de droit.
        </div>

        <div class="signature">
          Fait à Paris, le ${new Date().toLocaleDateString()}<br><br>
          <strong>Le Directeur</strong>
        </div>
      </div>
    </body>
  </html>
  `;

  const fenetre = window.open('', '_blank');
  if (fenetre) {
    fenetre.document.open();
    fenetre.document.write(contenu);
    fenetre.document.close();
    fenetre.print();
  }
}



}
