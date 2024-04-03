import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CostomValidator } from '../helpers/validators';
import { AccountService } from '../../services/account.service';
import { LoginModel } from '../../models/LoginModel';
import { lastValueFrom } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatInputModule,
    MatButton
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  creationForm: FormGroup;
  validator:CostomValidator
  constructor(
      public location:Location,
      private accountService:AccountService,
      private tokenService:TokenService,
      private router:Router,
      fb:FormBuilder){
        this.creationForm = fb.group({
          email:['',[Validators.required,Validators.email]],
          password:['',Validators.required]
        });
        this.validator = new CostomValidator(this.creationForm)
      }

  async login()
  {
     if(this.creationForm.invalid) return;
     let response = await lastValueFrom(this.accountService.login(this.creationForm.value as LoginModel));
     if(response.status == 200 && response.body){
        this.tokenService.saveTokens(response.body?.accessToken,response.body?.refreshToken);
        this.router.navigate(['/'])
     }
  }
}
