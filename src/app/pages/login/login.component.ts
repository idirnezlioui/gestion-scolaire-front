import { CommonModule } from '@angular/common';
import { Component ,inject} from '@angular/core';
import { FormBuilder,ReactiveFormsModule,Validator, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Login } from '../../models/login.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb=inject(FormBuilder)
  auth=inject(AuthService)
  router=inject(Router)

  

  errorMessage=""

  loginForm=this.fb.group({
    mail:['',[Validators.required,Validators.email]],
    mot_pass:['',Validators.required]
  })

  onSubmit() {
  if (this.loginForm.invalid) return;
   const login: Login = {
      mail: this.loginForm.get('mail')?.value!,
      mot_pass: this.loginForm.get('mot_pass')?.value!
    };
  this.auth.login(login).subscribe({
    next:()=>this.router.navigate(['/students']),
    error:err=>this.errorMessage='Identifiants incorrects'
  })
  

  console.log("les donne sont ",login); // Pour test temporaire
}



}


