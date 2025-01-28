import { Component } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-student-list',
  imports: [NavbarComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  //liste des etudiant

  students:Etudiant[]=[
    new Etudiant(1,"Idir","idirneliou4@gmail.com",23),
    new Etudiant(2,"Manel","manelselmani@gmail.com",29),
    new Etudiant(3,"pedri","pedrigansals@gmail.com",23),
    new Etudiant(4,"yamel","yamel@gmail.com",23),
  ]

}
