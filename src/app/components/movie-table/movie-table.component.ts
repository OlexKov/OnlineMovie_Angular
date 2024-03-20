import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { IMovie } from '../../models/IMovie';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MoviesService } from '../../services/movies.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-movie-table',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTableModule,
    DatePipe,
    MatProgressBarModule,
    NgIf,
    MatPaginator,
    MatPaginatorModule,
  ],
  templateUrl: './movie-table.component.html',
  styleUrl: './movie-table.component.css',
})
export class MovieTableComponent implements OnInit, AfterViewInit {
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

  dataSource: MatTableDataSource<IMovie>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.movieService
    .getAll()
    .pipe(delay(1000))
    .subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource<IMovie>(res);
        this.dataSource.paginator = this.paginator;
      }
    );
  }
  constructor(private movieService: MoviesService) { }
  ngOnInit(): void { }
}
