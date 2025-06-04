import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Etudiant } from '../../models/etudiant.model';
import { Module } from '../../models/module.model';
import { NotesService } from '../../service/notes.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentSearchComponent } from '../../components/student-search/student-search.component';

@Component({
  selector: 'app-notes-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    StudentSearchComponent
  ],
  templateUrl: './notes-form.component.html',
  styleUrl: './notes-form.component.css'
})
export class NotesFormComponent implements OnInit {
  formGroup!: FormGroup;
  selectedStudent: Etudiant | null = null;
  moyenne: number = 0;

  get notesArray(): FormArray {
    return this.formGroup.get('notes') as FormArray;
  }

  constructor(private fb: FormBuilder, private notesService: NotesService) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      notes: this.fb.array([])
    });
  }

  onStudentSelected(student: Etudiant) {
    this.selectedStudent = student;
    this.notesService.getModulesByEtudiant(student.num_etudiant!).subscribe((modules) => {
      const formGroups = modules.map((mod) =>
        this.fb.group({
          ref_module: [mod.ref_module],
          intitule: [mod.intitule],
          note: ['', [Validators.required, Validators.min(0), Validators.max(20)]]
        })
      );
      const formArray = this.fb.array(formGroups);
      this.formGroup.setControl('notes', formArray);

      this.notesArray.valueChanges.subscribe(() => this.calculerMoyenne());
    });
  }

  calculerMoyenne() {
    const notes = this.notesArray.value.map((n: any) => +n.note || 0);
    const total = notes.reduce((sum:number, val:number) => sum + val, 0);
    this.moyenne = notes.length ? total / notes.length : 0;
  }

  enregistrerNotes() {
    const notesPayload = this.notesArray.value.map((n: any) => ({
      ref_module: n.ref_module,
      num_etudiant: this.selectedStudent?.num_etudiant,
      note: n.note
    }));

    console.log('📤 Envoi des notes :', notesPayload);

    // this.notesService.saveNotes(notesPayload).subscribe(() => {
    //   alert("Notes enregistrées avec succès.");
    // });
  }
}
