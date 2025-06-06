import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NavbarComponent } from './../../components/navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { ProfsService } from '../../service/profs.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profs-form',
  imports: [NavbarComponent, ReactiveFormsModule],
  templateUrl: './profs-form.component.html',
  styleUrl: './profs-form.component.css',
})
export class ProfsFormComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profService: ProfsService,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  this.formGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    numero_telephone: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]],
    domaine_enseignement: ['', Validators.required]
  });

  const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    this.profService.getProfById(+id).subscribe((prof) => {
      console.log('Prof reçu pour modification :', prof);

      // Appliquer les valeurs dans le formulaire
      this.formGroup.patchValue({
        nom: prof.nom,
        prenom: prof.prenom,
        email: prof.email,
        numero_telephone: prof.numero_telephone,
        domaine_enseignement: prof.domaine_enseignement
      });

      // Optionnel : afficher dans la console tout le form
      console.log('Form après patchValue :', this.formGroup.value);
    });
  }
}


  submit(event: Event) {
    event.preventDefault();
    if (this.formGroup.valid) {
      this.profService.addProfs(this.formGroup.value).subscribe({
        next: (res) => {
          alert('Professeur ajouté avec succès !');
          this.formGroup.reset();
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de l'ajout.");
        },
      });
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.formGroup.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
