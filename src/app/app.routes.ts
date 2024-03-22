import { Routes } from '@angular/router';
import { MovieTableComponent } from './components/movie-table/movie-table.component';
import { StafTableComponent } from './components/staf-table/staf-table.component';

export const routes: Routes = [
  { path: '', redirectTo: '/movie-table', pathMatch: 'full' },
    // { path: 'products-list', component: ProductListComponent },
    { path: 'movie-table', component: MovieTableComponent },
    { path: 'staf-table', component: StafTableComponent },
];
