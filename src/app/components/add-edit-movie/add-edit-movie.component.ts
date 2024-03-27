import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ICountry } from '../../models/ICountry';
import { IStaf } from '../../models/IStaf';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { StafService } from '../../services/staf.service';
import { IMovie } from '../../models/IMovie';
import { FormValidators } from '../helpers/validators';
import { lastValueFrom } from 'rxjs';
import { MoviesService } from '../../services/movies.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImageProcessor } from '../helpers/file-loader';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { IGenre } from '../../models/IGenre';
import { IQuality } from '../../models/IQuality';
import { IPremium } from '../../models/IPremium';
import { MatIcon } from '@angular/material/icon';
import { IImage } from '../../models/IImage';

@Component({
  selector: 'app-add-edit-movie',
  standalone: true,
  imports: [
    MatGridListModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIcon,
  ],
  templateUrl: './add-edit-movie.component.html',
  styleUrl: './add-edit-movie.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AddEditMovieComponent implements OnInit {
  title: string;
  movie: IMovie;
  creationForm: FormGroup;
  countries: ICountry[] | null;
  stafs: IStaf[] | null;
  genres: IGenre[] | null;
  qualities: IQuality[] | null;
  premiums: IPremium[] | null;
  poster: string;
  formData = new FormData();
  today: Date = new Date();
  movieScreens: IImage[] | null = [];
  newScreens: File[] | null =  [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private stafService: StafService,
    private movieService: MoviesService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.route.queryParams.subscribe((res) => {
      if (res['movieItem'] == '')
        this.movie = {
          id: 0,
          name: '',
          originalName: '',
          date: new Date(Date.now()),
          duration: '',
          description: '',
          qualityId: 0,
          qualityName: '',
          countryId: 0,
          countryName: '',
          poster: '../assets/noposter.jpeg.jpg',
          movieUrl: '',
          trailerUrl: '',
          premiumId: 0,
          premiumName: '',
        };
      else this.movie = JSON.parse(res['movieItem']) as IMovie;
      this.title = res['title'];
    });
  }

  get formValidators(): typeof FormValidators {
    return FormValidators;
  }

  async ngOnInit(): Promise<void> {
    this.creationForm = this.fb.group({
      id: [0],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern('^[A-Z А-Я].*'),
        ],
      ],
      originalName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern('^[A-Z А-Я].*'),
        ],
      ],
      date: [''],
      duration: ['', [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(30),
          Validators.maxLength(3000),
        ],
      ],
      qualityId: [0, [Validators.min(1)]],
      countryId: [0, [Validators.min(1)]],
      poster: [''],
      posterFile: [null],
      movieUrl: ['', [Validators.required]],
      trailerUrl: ['', [Validators.required]],
      premiumId: [0, [Validators.min(1)]],
      stafs: [[], [Validators.required]],
      screenShots: [[], [Validators.required]],
      genres: [[], [Validators.required]],
      screenShotsFiles: [null],
    });

    if (this.movie.id != 0) this.formInit();
    this.poster = this.movie.poster;
    this.countries = (await lastValueFrom(this.dataService.getCountries()))
      .body as Array<ICountry>;
    this.stafs = (await lastValueFrom(this.stafService.getAll()))
      .body as Array<IStaf>;
    this.genres = (await lastValueFrom(this.dataService.getGenres()))
      .body as Array<IGenre>;
    this.qualities = (await lastValueFrom(this.dataService.getQualities()))
      .body as Array<IQuality>;
    this.premiums = (await lastValueFrom(this.dataService.getPremiums()))
      .body as Array<IPremium>;
  }

  async formInit() {
    let movieStafs = (
      await lastValueFrom(this.movieService.getStafs(this.movie.id))
    ).body?.map((x) => x.id);

    this.movieScreens = (
      await lastValueFrom(this.movieService.getScreens(this.movie.id))
    ).body;

    let movieGenres = (
      await lastValueFrom(this.movieService.getGenres(this.movie.id))
    ).body?.map((x) => x.id);

    this.creationForm.setValue({
      id: this.movie.id,
      name: this.movie.name,
      originalName: this.movie.originalName,
      date: this.movie.date,
      duration: this.movie.duration,
      description: this.movie.description,
      qualityId: this.movie.qualityId,
      countryId: this.movie.countryId,
      poster: this.movie.poster,
      posterFile: null,
      movieUrl: this.movie.movieUrl,
      trailerUrl: this.movie.trailerUrl,
      premiumId: this.movie.premiumId,
      stafs: movieStafs || [],
      screenShots: this.movieScreens?.map((x) => x.id) || [],
      genres: movieGenres || [],
      screenShotsFiles: [],
    });
  }

  async loadPoster(event: any) {
    const file: File = event.target.files[0];
    this.creationForm.controls['poster'].setValue(file);
    if (file) {
      this.poster = await ImageProcessor.loadImageFromFile(file);
      this.formData.set('poster', file, file.name);
    } else {
      this.formData.set('poster', '');
      this.poster = this.movie.poster;
    }
  }
  saveMovie() {
    if (this.creationForm.invalid) return;
  }

  deleteScreen(event: any) {
    this.movieScreens?.splice(event.target.id, 1);
    this.creationForm.controls['screenShots'].setValue(
      this.movieScreens?.filter((x) => x.id > 0).map((x) => x.id));
  }

  async addScreen(event: any) {
    const files: File[] = event.target.files;
    if (files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        this.newScreens?.push(files[index]);
        let image = {id:files[index].size,name:await ImageProcessor.loadImageFromFile(files[index])}

        this.movieScreens?.push(image);
        this.creationForm.controls['screenShots'].setValue(
          this.movieScreens?.filter((x) => x.id > 0).map((x) => x.id));
      }

    }
  }
}
