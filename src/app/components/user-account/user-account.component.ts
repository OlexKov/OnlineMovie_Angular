import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { IEditModel } from '../../models/EditModel';
import { TokenService } from '../../services/token.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatInputModule,
    MatButton,
    RouterLink,
    MatDatepickerModule,
  ],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css',
  providers: [provideNativeDateAdapter()],
})
export class UserAccountComponent {
  validator: CostomValidator;
  today: Date = new Date();
  creationForm: FormGroup;
  constructor(
    public location: Location,
    public accountService: AccountService,
    private snackBar: MatSnackBar,
    private router: Router,
    private tokenService: TokenService,
    private dialog: MatDialog,
    fb: FormBuilder
  ) {
    this.creationForm = fb.group({
      name: [
        accountService.getUserName(),
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z А-Я].*'),
        ],
      ],
      surname: [
        accountService.getUserSurname(),
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z А-Я].*'),
        ],
      ],
      birthdate: [accountService.getUserBirthdade(), Validators.required],
    });
    this.validator = new CostomValidator(this.creationForm);
  }

  save() {
    if (this.creationForm.invalid) return;
    let userData: IEditModel = {
      id: this.accountService.getUserId() || '',
      name: this.creationForm.controls['name'].value,
      surname: this.creationForm.controls['surname'].value,
      birthdate: this.creationForm.controls['birthdate'].value,
    };
    this.accountService.edit(userData).subscribe((res) => {
      if (res.status == 200) {
        this.tokenService.userData!.dateOfBirth = userData.birthdate;
        this.tokenService.userData!.name = userData.name;
        this.tokenService.userData!.surname = userData.surname;
        this.snackBar.open(
          'User information successfully changet...',
          'close',
          { duration: 3000 }
        );
        this.router.navigate(['/']);
      }
    });
  }

  removeAccount(){
    this.openDeleteDialog()
        .afterClosed()
        .subscribe((result)=>{
          if(result===true){
            let email = this.accountService.getUserEmail();
            if(email){
              this.accountService.delete(email).subscribe((response) => {
                if (response.status == 200) {
                  this.snackBar.open(
                    'Account successfully deleted',
                    'close',{duration: 3000}
                  );
                  this.router.navigate(['/']);
                  this.tokenService.removeTokens();
                }
              });
            }
          }
        });
  }
  openDeleteDialog() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete account',
        message: `Are you sure you want to delete "${this.accountService.getUserName()}" account ?`,
        mat_icon: 'delete',
        bs_color: 'text-danger',
      },
    });
  }

  resetPassword() {
    this.accountService.getResetToken().subscribe((res) => {
      if (res.status == 200) {
        console.log(res.body);
        this.router.navigateByUrl(
          `/resetpassword?token=${
            res.body
          }&id=${this.accountService.getUserEmail()}`
        );
      }
    });
  }

  isChanget(): boolean {
    return this.creationForm.dirty;
  }
}
