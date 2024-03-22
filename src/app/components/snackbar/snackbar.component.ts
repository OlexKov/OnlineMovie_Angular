import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
  template: 'passed in {{ data }}',
})
export class SnackbarComponent {
  @Inject(MAT_SNACK_BAR_DATA) public data: string
}
