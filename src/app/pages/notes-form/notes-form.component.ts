import { Etudiant } from './../../models/etudiant.model';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Module } from '../../models/module.model';
import { NotesService } from '../../service/notes.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentSearchComponent } from '../../components/student-search/student-search.component';
import { Note } from '../../models/note.model';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-notes-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    StudentSearchComponent,
  ],
  templateUrl: './notes-form.component.html',
  styleUrl: './notes-form.component.css',
})
export class NotesFormComponent implements OnInit {
  formGroup!: FormGroup;
  selectedStudent: Etudiant | null = null;
  moyenne: number = 0;
  notesExistantes: any[] = [];
  private toaster = inject(ToastrService);

  get notesArray(): FormArray {
    return this.formGroup.get('notes') as FormArray;
  }

  constructor(private fb: FormBuilder, private notesService: NotesService) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      notes: this.fb.array([]),
    });
  }

  onStudentSelected(student: Etudiant) {
    this.selectedStudent = student;

    this.notesService
      .getModulesByEtudiant(student.num_etudiant!)
      .subscribe((modules) => {
        this.notesService
          .getNotesByEtudiant(student.num_etudiant!)
          .subscribe((notesExistantes) => {
            this.notesExistantes = notesExistantes;

            const formGroups = modules.map((mod) => {
              const noteExistante: Note | undefined = notesExistantes.find(
                (n) => n.ref_module === mod.ref_module
              );
              return this.fb.group({
                ref_module: [mod.ref_module],
                intitule: [mod.intitule],
                note: [
                  noteExistante ? noteExistante.note : '',
                  [Validators.required, Validators.min(0), Validators.max(20)],
                ],
              });
            });

            const formArray = this.fb.array(formGroups);
            this.formGroup.setControl('notes', formArray);
            this.calculerMoyenne();

            // Recalcule la moyenne quand on modifie les notes
            this.notesArray.valueChanges.subscribe(() =>
              this.calculerMoyenne()
            );
          });
      });
  }

  calculerMoyenne() {
    const notes = this.notesArray.value.map((n: any) => +n.note || 0);
    const total = notes.reduce((sum: number, val: number) => sum + val, 0);
    this.moyenne = notes.length ? total / notes.length : 0;
  }

  enregistrerNotes() {
    const notes = this.notesArray.value;

    notes.forEach((n: any) => {
      const noteExistante = this.notesExistantes.find(
        (note) => String(note.ref_module) === String(n.ref_module)
      );

      const payload = {
        ref_module: n.ref_module,
        num_etudiant: this.selectedStudent?.num_etudiant!,
        note: n.note,
      };

      if (noteExistante) {
        const noteUpdate = {
          ...payload,
          ref_note: noteExistante.ref_note,
        };

        this.notesService.updateNote(noteUpdate).subscribe({
          next: () =>
            this.toaster.success(`Note Modifier pour ${n.ref_module}`),
          error: (err) => {
            this.toaster.error(`Erreur Modification ${n.ref_module}`);
            console.error(` Erreur update ${n.ref_module}`, err);
          },
        });
      } else {
        // INSERT sans ref_note
        this.notesService.insertNote(payload).subscribe({
          next: () => this.toaster.success(`Note insérée pour ${n.ref_module}`),
          error: (err) => {
            this.toaster.error(`Erreur insert ${n.ref_module}`);
            console.error(`Erreur insert ${n.ref_module}`, err);
          },
        });
      }
    });
  }

  getNoteClass(note: number): string {
    if (note < 10) return 'note-rouge';
    if (note === 10) return 'note-orange';
    if (note > 10) return 'note-verte';
    return '';
  }

  getMention(moyenne: number): string {
    if (moyenne >= 16) return 'Très Bien';
    if (moyenne >= 14) return 'Bien';
    if (moyenne >= 12) return 'Assez Bien';
    if (moyenne >= 10) return 'Passable';
    return 'Aucune';
  }

  genererReleve() {
    const doc = new jsPDF();
    const etu = this.selectedStudent!;
    const date = new Date().toLocaleDateString();
    const logo = 'img/Esmi.png'; // valide !

    // Logo + bandeau
    doc.addImage(logo, 'PNG', 10, 10, 25, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('École Supérieure de Commerce et Management', 105, 15, {
      align: 'center',
    });
    doc.text('RELEVE DE NOTES ET RESULTATS', 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Année universitaire : ${new Date().getFullYear()}`, 140, 10);

    // Infos étudiant
    doc.setFont('helvetica', 'normal');
    doc.text(`N° Etudiant : ${etu.num_etudiant}`, 10, 40);
    doc.text(`Nom : ${etu.nom} ${etu.prenom}`, 10, 46);
    doc.text(`Niveau : ${etu.niveau}`, 10, 52);
    doc.text(`Domaine : ${etu.intitule}`, 10, 58);
    doc.text(`Session : ${etu.type_session}`, 10, 64);
    doc.text(`Date d'impression : ${date}`, 10, 70);

    // Tableau de notes
    const notesData = this.notesArray.value.map((note: any) => [
      note.intitule,
      Number(note.note).toFixed(2),
      note.note < 10 ? 'Admis session 1' : 'Admis session 2',
    ]);

    autoTable(doc, {
      startY: 80,
      head: [['Module', 'Note (/20)', 'Observation']],
      body: notesData,
      theme: 'grid',
      styles: { halign: 'center' },
      headStyles: {
        fillColor: [100, 149, 237],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { fontStyle: 'bold' },
        2: { fontStyle: 'italic', textColor: 50 },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 100;

    // Moyenne & signature
    doc.setFont('helvetica', 'bold');
    doc.text(`Moyenne : ${this.moyenne.toFixed(2)} / 20`, 140, finalY + 10);

    // Décision & mention
    const decision = this.moyenne >= 10 ? 'Admis' : 'Non admis';
    const mention = this.getMention(this.moyenne);

    doc.setFont('helvetica', 'normal');
    doc.text(`Décision du jury : ${decision}`, 10, finalY + 20);
    doc.text(`Mention : ${mention}`, 10, finalY + 26);
    doc.text(`Signature de l'administration`, 140, finalY + 30);

    // Remarque en bas de page
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text(
      'Ce document est délivré en un seul exemplaire et ne peut être dupliqué sans autorisation.',
      10,
      285
    );

    // Sauvegarde
    doc.save(`Releve_${etu.nom}_${etu.prenom}.pdf`);
  }
}
