import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-student-paiment',
  imports: [FormsModule, CommonModule],
  templateUrl: './student-paiment.component.html',
  styleUrl: './student-paiment.component.css'
})
export class StudentPaimentComponent {
 

}
