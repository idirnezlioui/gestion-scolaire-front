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
}
