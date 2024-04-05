import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../../services/movies.service';
import { AsyncPipe } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { IMovie } from '../../models/IMovie';
import { lastValueFrom } from 'rxjs';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { IGenre } from '../../models/IGenre';

@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCardModule,
    NgbRatingModule,
    MatIcon,
    MatButton
  ],
  templateUrl: './all-movies.component.html',
  styleUrl: './all-movies.component.css',
  providers: [NgbRatingConfig]
})
export class AllMoviesComponent implements OnInit {
  movies:IMovie[]
   rating:number = 6
   constructor(private movieService:MoviesService,config: NgbRatingConfig){
    config.max = 8;
		config.readonly = true;
   }
  async ngOnInit() {
    this.movies = (await lastValueFrom(this.movieService.getAll())).body as IMovie[]
    for (let index = 0; index < this.movies.length; index++) {
       this.movies[index].genres = (await lastValueFrom(this.movieService.getGenres( this.movies[index].id))).body as IGenre[]
       this.movies[index].rating = (await lastValueFrom(this.movieService.getRating( this.movies[index].id))).body as number;
    }
  }

  getYear(date:string):number {
    return new Date(date).getFullYear();
  }




}
