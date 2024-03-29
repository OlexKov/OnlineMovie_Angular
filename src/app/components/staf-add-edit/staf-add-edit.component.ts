import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStaf } from '../../models/IStaf';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ICountry } from '../../models/ICountry';
import { IStafRole } from '../../models/IStafRole';
import { IMovie } from '../../models/IMovie';
import { DataService } from '../../services/data.service';
import { MoviesService } from '../../services/movies.service';
import { StafService } from '../../services/staf.service';
import { lastValueFrom } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImageProcessor } from '../helpers/file-loader';
import { CostomValidator } from '../helpers/validators';
import { Location } from '@angular/common';


@Component({
  selector: 'app-staf-add-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    NgOptimizedImage,
    MatDatepickerModule,
    MatGridListModule,
    MatCheckboxModule,
  ],
  templateUrl: './staf-add-edit.component.html',
  styleUrl: './staf-add-edit.component.css',
  providers: [provideNativeDateAdapter()],
})
export class StafAddEditComponent implements OnInit {
  staf: IStaf;
  title: string;
  creationForm: FormGroup;
  countries: ICountry[] | null;
  roles: IStafRole[] | null;
  movies: IMovie[] | null;
  photo: string;
  formData = new FormData();
  today:Date = new Date();
  validator:CostomValidator;
  stafId:number = 0;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private movieService: MoviesService,
    private stafService: StafService,
    private fb: FormBuilder,
    private location: Location,
  ) {
    this.route.queryParams.subscribe((res) => {
      this.stafId = res['stafId'];
      this.title = res['title'];
    });
  }

 async formInit() {
    let stafMovies = (
      await lastValueFrom(this.stafService.getmovies(this.staf.id))
    ).body?.map((x) => x.id);
    let stafRoles = (
      await lastValueFrom(this.stafService.getroles(this.staf.id))
    ).body?.map((x) => x.id);

    this.creationForm.setValue({
      id: this.staf.id,
      name: this.staf.name,
      surname: this.staf.surname,
      description: this.staf.description,
      imageName: this.staf.imageName,
      countryId: this.staf.countryId,
      birthdate: this.staf.birthdate,
      isOscar: this.staf.isOscar,
      movies: stafMovies,
      roles: stafRoles,
    });
  }

  async ngOnInit() {
    this.creationForm = this.fb.group({
      id: [0],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z А-Я].*'),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z А-Я].*'),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(30),
          Validators.maxLength(1024),
        ],
      ],
      imageName: [''],
      countryId: [null,[Validators.required]],
      birthdate: ['',[Validators.required]],
      isOscar: [false],
      movies: [[]],
      roles: [[],Validators.required],
    });
    this.validator = new CostomValidator(this.creationForm)
    if (this.stafId == 0)
        this.staf = {
          id: 0,
          name: '',
          surname: '',
          description: '',
          imageName: '../assets/nophoto.jpeg.jpg',
          countryName: '',
          countryId: 0,
          birthdate: new Date(),
          isOscar: false,
        };
        else {
          const val = (await lastValueFrom(this.stafService.get(this.stafId))).body;
          if(val)this.staf = val;
          this.formInit();
        }

    this.photo = this.staf.imageName;
    this.countries = (await lastValueFrom(this.dataService.getCountries()))
      .body as Array<ICountry>;
    this.roles = (await lastValueFrom(this.dataService.getRoles()))
      .body as Array<IStafRole>;
    this.movies = (await lastValueFrom(this.movieService.getAll()))
      .body as Array<IMovie>;
  }

  async saveStaf() {
    if(this.creationForm.invalid) return;
    const id = this.creationForm.controls['id'].value;
    let responce: number = 0;
    this.formGroupToFormData(this.creationForm,this.formData)
    if (id != 0)
      responce = (await lastValueFrom(this.stafService.update(this.formData)))
        .status;
    else
      responce = (await lastValueFrom(this.stafService.create(this.formData)))
        .status;
    if (responce == 200)this.location.back()  //this.router.navigate(['/movie-table']);
  }
  async loadPhoto(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.photo = await ImageProcessor.loadImageFromFile(file);
      this.formData.set('imageFile', file);
    } else {
      this.formData.set('imageFile', '');
      this.photo = this.staf.imageName;
    }
  }

  private formGroupToFormData(group:FormGroup,formData:FormData)
  {
    for (let key in group.controls) {
      if (key == 'roles' || key == 'movies') {
        let data = group.controls[key].value;
        for (let i = 0; i < data.length; i++)
           formData.append(key, data[i]);
      } else if (key == 'birthdate') {
           const date = group.controls[key].value as Date;
           if (typeof date != 'string')
               formData.append(key, date.toLocaleDateString());
           else formData.append(key, group.controls[key].value);
      }    else formData.append(key, group.controls[key].value);
    }
  }


}
