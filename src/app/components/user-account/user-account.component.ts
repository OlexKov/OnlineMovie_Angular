import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { CostomValidator } from '../helpers/validators';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { Location } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    RouterLink,
    MatDatepickerModule
  ],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css',
  providers: [provideNativeDateAdapter()],
})
export class UserAccountComponent {
  validator:CostomValidator;
  today:Date = new Date();
  creationForm: FormGroup;
  constructor(
    public location:Location,
    public accountService:AccountService,
    private snackBar:MatSnackBar,
    private router:Router,
    fb:FormBuilder){
      this.creationForm = fb.group({
        name:[accountService.getUserName(),
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z А-Я].*')
        ]],
        surname:[accountService.getUserSurname(),
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z А-Я].*')
        ]],
        birthdate:[accountService.getUserBirthdade(),Validators.required],

      });
      this.validator = new CostomValidator(this.creationForm);
    }

  save(){}
  resetPassword(){
    this.accountService.getResetToken().subscribe(res=>{
      if(res.status == 200){
        console.log(res.body)
         this.router.navigateByUrl(`/resetpassword?token=${res.body}&id=${this.accountService.getUserEmail()}`)
      }
    })
  }
  isChanget():boolean{
     return this.creationForm.dirty && this.creationForm.touched
  }
}
