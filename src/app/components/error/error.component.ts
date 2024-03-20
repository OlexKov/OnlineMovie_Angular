import { Component } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [NgbAlertModule,AsyncPipe ,NgIf],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent {
    constructor(public errorService:ErrorService){}
}
