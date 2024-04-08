import { Routes } from '@angular/router';
import { MovieTableComponent } from './components/movie-table/movie-table.component';
import { StafTableComponent } from './components/staf-table/staf-table.component';
import { StafAddEditComponent } from './components/staf-add-edit/staf-add-edit.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AddEditMovieComponent } from './components/add-edit-movie/add-edit-movie.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AllMoviesComponent } from './components/all-movies/all-movies.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { adminGuard } from './guards/admin.guard';
import { FogotpasswordComponent } from './components/fogotpassword/fogotpassword.component';
import { authenticatedGuard } from './guards/authenticated.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


export const routes: Routes = [
  { path: '', redirectTo: '/allmovies', pathMatch: 'full' },
  { path: 'movie-table', component: MovieTableComponent ,canActivate: [adminGuard]},
  { path: 'staf-table', component: StafTableComponent ,canActivate: [adminGuard]},
  { path: 'add-edit-staf', component: StafAddEditComponent  ,canActivate: [adminGuard]},
  { path: 'add-edit-movie', component: AddEditMovieComponent ,canActivate: [adminGuard] },
  { path: 'register', component: RegisterComponent  },
  { path: 'login', component: LoginComponent  },
  { path: 'allmovies', component: AllMoviesComponent  },
  { path: 'useraccount', component: UserAccountComponent ,canActivate: [authenticatedGuard]},
  { path: 'forbidden', component: ForbiddenComponent},
  { path: 'fogotpassword', component: FogotpasswordComponent},
  { path: 'resetpassword',  component: ResetPasswordComponent},
  { path: '**', component: NotFoundComponent  }
];
