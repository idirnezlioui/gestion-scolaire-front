import { CommonModule } from '@angular/common';
import { Component ,inject} from '@angular/core';
import { FormBuilder,ReactiveFormsModule,Validator, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb=inject(FormBuilder)
  //auth=inject(AuthService)
  //router=inject(Router)

  errorMessage=""

  loginForm=this.fb.group({
    mail:['',[Validators.required,Validators.email]],
    mot_pass:['',Validators.required]
  })

  onSubmit() {
  if (this.loginForm.invalid) return;

  // this.auth.login(this.loginForm.value).subscribe({
  //   next: () => this.router.navigate(['/dashboard']),
  //   error: (err) => {
  //     this.errorMessage = err.error?.message || 'Erreur inconnue';
  //   }
  // });

  console.log(this.loginForm.value); // Pour test temporaire
}



}


