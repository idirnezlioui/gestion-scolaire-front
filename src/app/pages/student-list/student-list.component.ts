import { Component, OnInit } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { StudentService } from '../../service/student.service';

@Component({
  selector: 'app-student-list',
  imports: [NavbarComponent , CommonModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {

  //liste des etudiant
  etudinats:Etudiant[]=[]
  constructor(private etudiantService :StudentService){}
  ngOnInit(): void {
    this.etudiantService.getEtudiants().subscribe((data:Etudiant[])=>{
      this.etudinats=data
      console.log(this.etudinats)
    })
  }
}
