import { Component, Inject} from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { IErrors } from '../../models/Errors';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-error-view',
  standalone: true,
  imports: [MatButton],
  templateUrl: './error-view.component.html',
  styleUrl: './error-view.component.css'
})
export class ErrorViewComponent {
  constructor(public snackBarRef: MatSnackBarRef<ErrorViewComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any, errorService:ErrorService){
  }
}
