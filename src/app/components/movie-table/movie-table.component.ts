import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { delay } from 'rxjs';
import { IMovie } from '../../models/IMovie';
import { DatePipe} from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MoviesService } from '../../services/movies.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-movie-table',
  standalone: true,
  imports: [
     MatTableModule,
    DatePipe,
    MatProgressBarModule,
    MatPaginator,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    NgOptimizedImage
  ],
  templateUrl: './movie-table.component.html',
  styleUrl: './movie-table.component.css',
})
export class MovieTableComponent implements  AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'poster',
    'year',
    'name',
    'original',
    'country',
    'quality',
    'duration',
    'premium',
    'edit',
    'delete',
  ];

  dataSource: MatTableDataSource<IMovie>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  updateTableData() {
    this.movieService
      .getAll()
      .pipe(delay(10))
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource<IMovie>(res.body as IMovie[]);
        this.dataSource.paginator = this.paginator;
      });
  }

  ngAfterViewInit() {
    this.updateTableData();
  }
  constructor(private movieService: MoviesService, public dialog: MatDialog) {}

  openDeleteDialog(movie: IMovie) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete movie',
        message: `Are you sure you want to delete "${movie.name}" movie?`,
        mat_icon:'delete',
        bs_color:'text-danger'
      },
    });
  }
  deleteMovie(movie: IMovie) {
    this.openDeleteDialog(movie)
      .afterClosed()
      .subscribe((result) => {
        if (result === true) {
          this.movieService.remove(movie.id).subscribe((response) => {
             if (response.status == 200) this.updateTableData();
          });
        }
      });
  }
}
