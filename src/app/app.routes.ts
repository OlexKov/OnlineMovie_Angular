import { Routes } from '@angular/router';
import { MovieTableComponent } from './components/movie-table/movie-table.component';
import { StafTableComponent } from './components/staf-table/staf-table.component';
import { StafAddEditComponent } from './components/staf-add-edit/staf-add-edit.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/movie-table', pathMatch: 'full' },
  { path: 'movie-table', component: MovieTableComponent },
  { path: 'staf-table', component: StafTableComponent },
  { path: 'add-edit-staf', component: StafAddEditComponent  },
  { path: '**', component: NotFoundComponent  }



];
