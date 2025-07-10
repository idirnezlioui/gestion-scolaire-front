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
          margin: 60px;
          font-size: 15px;
          color: #000;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        .header img {
          height: 80px;
        }
        .title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin: 30px 0 20px;
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
      <div class="header">
        <img src="img/logoEcole.png" alt="Logo" />
        <h2>Institut GoldenCollar</h2>
        <p><em>Établissement d’Enseignement Supérieur Privé</em></p>
      </div>

      <div class="title">ATTESTATION D’INSCRIPTION</div>

      <div class="content">
        Nous soussignés, <strong>Institut GoldenCollar</strong>, attestons que :<br><br>

        <span class="label">Identifiant :</span> ${student.num_etudiant}<br>
        <span class="label">Nom :</span> ${student.nom}<br>
        <span class="label">Prénom :</span> ${student.prenom}<br>
        <span class="label">Nationalité :</span> ${student.nationalite }<br>
        <span class="label">Spécialité :</span> ${student.domaine || '---'}<br>
        <span class="label">Niveau :</span> ${student.niveau || '---'}<br>
        <span class="label">Session :</span> ${student.type_session || '---'}<br>
        <span class="label">Date d'inscription :</span> ${student.date_inse || '---'}<br><br>

        A la fin de l'année scolaire , si le condidat réussit toutes les évaluations et l'exament final, nous lui déliveron une attestation de réussite, 
        qui lui permettera de s'insecrire à un niveau supérieur .


        pour servir et fair valoir ce que de droit 
        </div>

      <div class="signature">
        Fait à Paris, le ${new Date().toLocaleDateString()}<br><br>
        <strong>Directeur de l'établissement</strong>
      </div>
      <div class="footer">
  <p>
    <strong>INSTITUT GOLDENCOLLAR</strong> – 30 rue Esquirol – 75013 Paris<br>
    Établissement d’Enseignement Supérieur Privé – Rectorat de Paris – UAI : 0756509P<br>
    Tél. : 01 47 83 32 03 / 01 47 83 32 34 – 
    <a href="mailto:admission@goldencollar.fr">admission@goldencollar.fr</a> 
    <a href="mailto:scolarite@goldencollar.fr">scolarite@goldencollar.fr</a><br>
    RCS Paris Siren : 443 143 164 – Organisme de formation enregistré à la DREETS d'Île-de-France sous le N° 11753728175
  </p>
</div>

<style>
   .footer {
  margin-top: 70px;
  font-size: 11px;
  color: #000;
  text-align: center;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  line-height: 1.6;
}




</style>

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
          margin: 60px;
          font-size: 15px;
          color: #000;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header img {
          height: 80px;
          margin-bottom: 10px;
        }

        .institution {
          font-size: 18px;
          font-weight: bold;
        }

        .title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          text-decoration: underline;
          margin: 30px 0;
        }

        .content {
          line-height: 1.8;
          text-align: justify;
        }

        .label {
          font-weight: bold;
        }

        .signature {
          margin-top: 60px;
          text-align: right;
        }

        .footer {
  margin-top: 70px;
  font-size: 11px;
  color: #000;
  text-align: center;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  line-height: 1.6;
}

      </style>
    </head>
    <body>
      <div class="header">
        <img src="img/logoEcole.png" alt="Logo" />
        <div class="institution">Institut GoldenCollar</div>
        <p><em>Établissement d’Enseignement Supérieur Privé</em></p>
      </div>

      <div class="title">CERTIFICAT DE SCOLARITÉ</div>

      <div class="content">
        Nous, soussignés, <strong>Institut GoldenCollar</strong>, certifions que :<br><br>

        <span class="label">Identifiant :</span> ${student.num_etudiant}<br>
        <span class="label">Nom :</span> ${student.nom}<br>
        <span class="label">Prénom :</span> ${student.prenom}<br>
        <span class="label">Nationalité :</span> ${student.nationalite }<br>
        <span class="label">Spécialité :</span> ${student.intitule || '---'}<br>
        <span class="label">Niveau :</span> ${student.niveau || '---'}<br>
        <span class="label">Session :</span> ${student.type_session || '---'}<br>
        <span class="label">Date d'inscription :</span> ${student.date_inse || '---'}<br><br>

         A la fin de l'année scolaire , si le condidat réussit toutes les évaluations et l'exament final, nous lui déliveron une attestation de réussite, 
        qui lui permettera de s'insecrire à un niveau supérieur .


        pour servir et fair valoir ce que de droit 
      </div>

      <div class="signature">
        Fait à Paris, le ${new Date().toLocaleDateString()}<br><br>
        <strong>Le Directeur</strong>
      </div>

      <div class="footer">
  <p>
    <strong>INSTITUT GOLDENCOLLAR</strong> – 30 rue Esquirol – 75013 Paris<br>
    Établissement d’Enseignement Supérieur Privé – Rectorat de Paris – UAI : 0756509P<br>
    Tél. : 01 47 83 32 03 / 01 47 83 32 34 – 
    <a href="mailto:admission@goldencollar.fr">admission@goldencollar.fr</a> /
    <a href="mailto:scolarite@goldencollar.fr">scolarite@goldencollar.fr</a><br>
    RCS Paris Siren : 443 143 164 – Organisme de formation enregistré à la DREETS d'Île-de-France sous le N° 11753728175
  </p>
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
