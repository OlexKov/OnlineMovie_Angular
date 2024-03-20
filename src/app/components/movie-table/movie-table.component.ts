import { Component, OnInit } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { IMovie } from '../../models/IMovie';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MoviesService } from '../../services/movies.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-movie-table',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTableModule,
    DatePipe,
    MatProgressBarModule,
    NgIf
  ],
  templateUrl: './movie-table.component.html',
  styleUrl: './movie-table.component.css',
})
export class MovieTableComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'year',
    'name',
    'original',
    'country',
    'quality',
    'duration',
    'premium',
  ];
  dataSource: Observable<IMovie[]>;
  constructor(private movieService: MoviesService) {}
  ngOnInit(): void {
    this.dataSource = this.movieService.getAll().pipe(delay(0));
  }
}
