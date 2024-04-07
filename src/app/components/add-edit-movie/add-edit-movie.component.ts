import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ICountry } from '../../models/ICountry';
import { IStaf } from '../../models/IStaf';
import { ActivatedRoute} from '@angular/router';
import { DataService } from '../../services/data.service';
import { StafService } from '../../services/staf.service';
import { IMovie } from '../../models/IMovie';
import { CostomValidator } from '../helpers/validators';
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
import { RouterLink } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    RouterLink
  ],
  templateUrl: './add-edit-movie.component.html',
  styleUrl: './add-edit-movie.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AddEditMovieComponent implements OnInit {
  defaultPoster:string='../assets/nophoto.jpg'
  title: string;
  movie: IMovie;
  creationForm: FormGroup;
  countries: ICountry[] | null;
  stafs: IStaf[] | null;
  genres: IGenre[] | null;
  qualities: IQuality[] | null;
  premiums: IPremium[] | null;
  poster: string = this.defaultPoster;
  posterFile:File;
  today: Date = new Date();
  movieScreens: IImage[] | null = [];
  newScreens: File[] | null =  [];
  validator :CostomValidator;
  movieId:number = 0;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private stafService: StafService,
    private movieService: MoviesService,
    private fb: FormBuilder,
    public location: Location,
    private messageBar: MatSnackBar)
     {
      this.route.queryParams.subscribe((res) => {
      this.movieId = res['movieId'];
      this.title = res['title'];
    });
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
      date: ['', [Validators.required]],
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
      poster: [this.defaultPoster],
      movieUrl: ['', [Validators.required]],
      trailerUrl: ['', [Validators.required]],
      premiumId: [0, [Validators.min(1)]],
      stafs: [[], [Validators.required]],
      screenShots: [[], [Validators.required]],
      genres: [[], [Validators.required]],
    });
    this.validator = new CostomValidator(this.creationForm)
    if (this.movieId != 0){
      const val = (await lastValueFrom(this.movieService.get(this.movieId))).body
      if(val) this.movie = val;
         await this.formInit();
      this.poster = this.movie.poster;
    }
    this.countries = (await lastValueFrom(this.dataService.getCountries())).body;
    this.stafs = (await lastValueFrom(this.stafService.getAll())).body;
    this.genres = (await lastValueFrom(this.dataService.getGenres())).body;
    this.qualities = (await lastValueFrom(this.dataService.getQualities())).body;
    this.premiums = (await lastValueFrom(this.dataService.getPremiums())).body;

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
      movieUrl: this.movie.movieUrl,
      trailerUrl: this.movie.trailerUrl,
      premiumId: this.movie.premiumId,
      stafs: movieStafs || [],
      screenShots: this.isScreensExist,
      genres: movieGenres || [],
    });
  }

  async loadPoster(event:any) {
    const file: File = event.target.files[0];
    if (file)
      this.poster = await ImageProcessor.loadImageFromFile(file);
    else
      this.poster = this.movie.poster;
    this.posterFile = file;
  }
  async saveMovie() {
    let responce: HttpResponse<object> | null;
    if (this.creationForm.invalid) return;
    const id = this.creationForm.controls['id'].value;
    var data = this.createFormData();

    if (id != 0)
      responce = (await lastValueFrom(this.movieService.update(data)));
    else
      responce = (await lastValueFrom(this.movieService.create(data)))

    if (responce.status == 200){
      this.messageBar.open(`Movie successfully ${id==0?"created":"chanded"}`,'close',{
        duration: 3000
      });
      this.location.back();
    }
  }

  deleteScreen(event: any) {
    this.movieScreens?.splice(event.target.id, 1);
    this.updateScreenshotCreationForm();
    let file = this.newScreens?.find(x=>x.size == -event.target.id);
    let index:number|undefined = -1;
    if(file)
       index = this.newScreens?.indexOf(file);
    if(index)
       this.newScreens?.splice(index,1);
  }

  private get isScreensExist(){
    return this.movieScreens ? this.movieScreens.length > 0 ? 'as' : '' : '';
  }

  private updateScreenshotCreationForm(){
    this.creationForm.controls['screenShots'].setValue(this.isScreensExist);
  }

  async addScreen(event: any) {
    const files: File[] = event.target.files;
    if (files.length > 0) {
      for (let index = 0; index < files.length; index++) {
        this.newScreens?.push(files[index]);
        let image = {
          id:-files[index].size,
          name:await ImageProcessor.loadImageFromFile(files[index])
        }
        this.movieScreens?.push(image);
        this.updateScreenshotCreationForm();
      }
    }

  }

  private createFormData():FormData
  {
    let formData:FormData = new FormData()
    if(this.movieScreens?.length)
      for (let i=0;i < this.movieScreens.length; i++)
         if(this.movieScreens[i]?.id > 0)
             formData.append('screenShots',this.movieScreens[i].id as unknown as string);

    if(this.newScreens?.length)
       for (let i=0;i < this.newScreens.length; i++)
               formData.append('screens',this.newScreens[i]);

    for (let key in this.creationForm.controls) {
      if(key == 'screenShots' || key =='duration') continue;
      if (key == 'stafs' || key == 'genres') {
        let data = this.creationForm.controls[key].value;
        for (let i = 0; i < data.length; i++)
           formData.append(key, data[i]);
      }
      else if (key == 'date') {
               let date = this.creationForm.controls[key].value as Date;
               let duration = this.creationForm.controls['duration'].value
               if (typeof date != 'string')
                   formData.append('dateDuration', date.toLocaleDateString()+' '+ duration);
               else formData.append('dateDuration', date +' '+ duration);
            }
      else formData.append(key, this.creationForm.controls[key].value);
    }
    formData.append('posterFile', this.posterFile);
    return formData;
  }
}
