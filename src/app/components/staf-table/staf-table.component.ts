import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { IStaf } from '../../models/IStaf';
import { StafService } from '../../services/staf.service';
import { delay } from 'rxjs';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-staf-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './staf-table.component.html',
  styleUrl: './staf-table.component.css'
})
export class StafTableComponent implements  AfterViewInit {

  displayedColumns: string[] = [
    'id',
    'image',
    'date',
    'name',
    'surname',
    'country',
    'edit',
    'delete',
  ];
  dataSource: MatTableDataSource<IStaf>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private stafService: StafService, public dialog: MatDialog) {}

  updateTableData() {
    this.stafService
      .getAll()
      .pipe(delay(10))
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource<IStaf>(res.body as IStaf[]);
        this.dataSource.paginator = this.paginator;
      });
  }
  ngAfterViewInit(): void {
    this.updateTableData();
  }
  openDeleteDialog(staf: IStaf) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete staf',
        message: `Are you sure you want to delete "${staf.name} ${staf.surname}" ?`,
        mat_icon:'delete',
        bs_color:'text-danger'
      },
    });
  }
  deleteStaf(staf: IStaf) {
    this.openDeleteDialog(staf)
      .afterClosed()
      .subscribe((result) => {
        if (result === true) {
          this.stafService.remove(staf.id).subscribe((response) => {
            if (response.status == 200)
              this.updateTableData();
          });
        }
      });
  }

}
