import { Component, OnInit } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { StudentService } from '../../service/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  imports: [NavbarComponent , CommonModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {

  //liste des etudiant
  etudinats:Etudiant[]=[]
  constructor(private etudiantService :StudentService,private router:Router){}
  ngOnInit(): void {
    this.etudiantService.getEtudiants().subscribe((data:Etudiant[])=>{
      this.etudinats=data
      console.log("donnee reçue ",data)
      
    })
  }

  goToPaiement(student: any) {
  this.router.navigate(['/paiement', student.num_etudiant]);
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
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Logo_Eiffel.svg/2048px-Logo_Eiffel.svg.png" alt="Logo" />
        <h2>Institut GoldenCollar</h2>
        <p><em>Établissement d’Enseignement Supérieur Privé</em></p>
      </div>

      <div class="title">ATTESTATION D’INSCRIPTION</div>

      <div class="content">
        Nous soussignés, <strong>Institut GoldenCollar</strong>, attestons que :<br><br>

        <span class="label">Nom :</span> ${student.nom}<br>
        <span class="label">Prénom :</span> ${student.prenom}<br>
        <span class="label">Nationalité :</span> ${student.nationalite }<br>
        <span class="label">Spécialité :</span> ${student.intitule || '---'}<br>
        <span class="label">Niveau :</span> ${student.niveau || '---'}<br>
        <span class="label">Session :</span> ${student.type_session || '---'}<br>
        <span class="label">Date d'inscription :</span> ${student.date_inse || '---'}<br><br>

        Est régulièrement inscrit(e) pour l’année académique en cours.<br>
      </div>

      <div class="signature">
        Fait à Paris, le ${new Date().toLocaleDateString()}<br><br>
        <strong>Directeur de l'établissement</strong>
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
          margin-top: 50px;
          font-size: 12px;
          text-align: center;
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Logo_Eiffel.svg/2048px-Logo_Eiffel.svg.png" alt="Logo" />
        <div class="institution">Institut GoldenCollar</div>
        <p><em>Établissement d’Enseignement Supérieur Privé</em></p>
      </div>

      <div class="title">CERTIFICAT DE SCOLARITÉ</div>

      <div class="content">
        Nous, soussignés, <strong>Institut GoldenCollar</strong>, certifions que :<br><br>

        <span class="label">Nom :</span> ${student.nom}<br>
        <span class="label">Prénom :</span> ${student.prenom}<br>
        <span class="label">Nationalité :</span> ${student.nationalite }<br>
        <span class="label">Spécialité :</span> ${student.intitule || '---'}<br>
        <span class="label">Niveau :</span> ${student.niveau || '---'}<br>
        <span class="label">Session :</span> ${student.type_session || '---'}<br>
        <span class="label">Date d'inscription :</span> ${student.date_inse || '---'}<br><br>

        Est inscrit(e) en qualité d'étudiant(e) régulier(e) dans notre établissement pour l'année académique en cours, conformément aux règles et obligations pédagogiques et administratives de l'école.
      </div>

      <div class="signature">
        Fait à Paris, le ${new Date().toLocaleDateString()}<br><br>
        <strong>Le Directeur</strong>
      </div>

      <div class="footer">
        Institut GoldenCollar – Campus Manager © ${new Date().getFullYear()}
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
