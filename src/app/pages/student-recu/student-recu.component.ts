import { Etudiant } from './../../models/etudiant.model';
import { paiements } from './../../models/paiment.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-student-recu',
  imports: [],
  templateUrl: './student-recu.component.html',
  styleUrl: './student-recu.component.css'
})
export class StudentRecuComponent {

  @Input() paiement!:paiements
  @Input() etudiant: Partial<Etudiant>={}

  currentDate:string=new Date().toLocaleDateString()
  ngOnChanges() {
    console.log("Reçu mis à jour :", this.paiement, this.etudiant);
  }
  printRecu() {
    const printContent = document.getElementById('print-section');
    if (printContent) {
      const windowPrint = window.open('', '', 'width=800,height=600');
      if (windowPrint) {
        windowPrint.document.write('<html><head><title>Reçu de Paiement</title></head><body>');
        windowPrint.document.write(printContent.innerHTML);
        windowPrint.document.write('</body></html>');
        windowPrint.document.close();
        windowPrint.print();
      }
    }
  }

}
