import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { lastValueFrom } from 'rxjs';
import { Validators, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { CostomValidator } from '../helpers/validators';


@Component({
  selector: 'app-fogotpassword',
  standalone: true,
  imports: [
    MatIcon,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './fogotpassword.component.html',
  styleUrl: './fogotpassword.component.css'
})
export class FogotpasswordComponent {
  sended:boolean = false;
  formGroup:FormGroup;
  validator :CostomValidator;

  constructor(
    public location:Location,
    private snackBar:MatSnackBar,
    public router:Router,
    private accountService:AccountService,
    fb:FormBuilder){
      this.formGroup = fb.group({
        email: ['', [Validators.email,Validators.required]]
      });
      this.validator = new CostomValidator(this.formGroup)
    }

  async send()
  {
    if(this.formGroup.invalid) return;
    const responce = (await lastValueFrom(this.accountService.fogot(this.formGroup.controls['email'].value))).status
    if(responce == 200){
      this.snackBar.open('Message successfully sended...','close',{duration:3000})
      this.sended = true;
    }
  }
}
