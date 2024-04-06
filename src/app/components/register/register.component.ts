import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { CostomValidator } from '../helpers/validators';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { Location } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { IRegisterModel } from '../../models/RegisterModel';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatorHelperService } from '../../services/validator-helper.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    RouterLink,
    MatDatepickerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [provideNativeDateAdapter()],
})
export class RegisterComponent {
  creationForm: FormGroup;
  validator:CostomValidator;
  today:Date = new Date();
  constructor(
    public location:Location,
    public accountService:AccountService,
    private snackBar:MatSnackBar,
    private router:Router,
    private validatorHelper:ValidatorHelperService,
    fb:FormBuilder){
      this.creationForm = fb.group({
        email:['',[Validators.required,Validators.email]],
        password:['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
          Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\\w\\s]|[_])).{6,}$')
        ]],
        confirmPassword:[''],
        name:['',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z А-Я].*')
        ]],
        surname:['',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z А-Я].*')
        ]],
        birthdate:['',Validators.required],
        phoneNumber:['',[Validators.pattern("^\\d{3}[-\\s]{1}\\d{3}[-\\s]{1}\\d{2}[-\\s]{0,1}\\d{2}$")]]
      },{validator: this.validatorHelper.confirmedValidator('password', 'confirmPassword')},);
      this.validator = new CostomValidator(this.creationForm)
    }

    async register(){
      if(this.creationForm.invalid) return;
      let user:IRegisterModel = {
        name:this.creationForm.controls['name'].value,
        surname:this.creationForm.controls['surname'].value,
        email: this.creationForm.controls['email'].value,
        password: this.creationForm.controls['password'].value,
        premiumId: 1,
        phoneNumber: this.creationForm.controls['phoneNumber'].value,
        birthdate: this.creationForm.controls['birthdate'].value,
        role: this.accountService.isAdmin()?'Admin':'User'
      }
      const status = (await lastValueFrom(this.accountService.register(user))).status;
      if(status == 200)
      {
          this.router.navigate(['/']);
          this.snackBar.open(`${this.accountService.isAdmin()?'Administrator':'User'} succeffuly registered...`,'close',{duration:3000})
      }
    }




}

