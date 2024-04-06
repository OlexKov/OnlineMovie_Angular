import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { IResetPasswordModel } from '../../models/ResetPasswordModel';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CostomValidator } from '../helpers/validators';
import { ValidatorHelperService } from '../../services/validator-helper.service';
import { AccountService } from '../../services/account.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  resetToken: string;
  userEmail: string;
  validator :CostomValidator;
  creationForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private snackBar:MatSnackBar,
    private validatorHelper:ValidatorHelperService,
    private accountService:AccountService,
    private router:Router
  ) {
      this.route.queryParams.subscribe(params => {
          this.resetToken = params['token'];
          this.resetToken = this.resetToken.replaceAll(" ","+")
          this.userEmail = params['id'];
      });
      console.log(this.resetToken)
  }
  ngOnInit(): void {
    this.creationForm = this.fb.group({
       password:['',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16),
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\\w\\s]|[_])).{6,}$')
      ]],
      confirmPassword:['']
   },{validator: this.validatorHelper.confirmedValidator('password', 'confirmPassword')});
   this.validator = new CostomValidator(this.creationForm);
}
 async  reset(){
     if(this.creationForm.invalid) return;
     const resetModel:IResetPasswordModel = {
       userEmail: this.userEmail,
       password: this.creationForm.controls['password'].value,
       token: this.resetToken
     }
     if((await lastValueFrom(this.accountService.resetPassword(resetModel))).status == 200){
        this.snackBar.open("Password successfully reseted...","close",{duration:3000});
        this.router.navigate(['/']);
     }
  }
}
