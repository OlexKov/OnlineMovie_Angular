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
import { IStafCreationModel } from '../../models/IStafCreationModel';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ImageProcessor } from '../helpers/file-loader';

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
  photo: string ;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private movieService: MoviesService,
    private stafService: StafService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.route.queryParams.subscribe((res) => {
      if (res['stafItem'] == '')
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
      else this.staf = JSON.parse(res['stafItem']);
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
      imageFile: [null],
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
          Validators.pattern('^[A-Z].*'),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z].*'),
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
      imageFile: [undefined],
      countryId: [null],
      birthdate: [''],
      isOscar: [false],
      movies: [[]],
      roles: [[]],
    });

    if (this.staf.id != null) this.formInit();
    this.photo = this.staf.imageName;
    this.countries = (await lastValueFrom(this.dataService.getCountries()))
      .body as Array<ICountry>;
    this.roles = (await lastValueFrom(this.dataService.getRoles()))
      .body as Array<IStafRole>;
    this.movies = (await lastValueFrom(this.movieService.getAll()))
      .body as Array<IMovie>;
  }

  async saveStaf() {
    const formData = new FormData();
    const id = this.creationForm.controls['id'].value;
    let responce: number = 0;
    for (let key in this.creationForm.controls) {
      if (key == 'roles' || key == 'movies') {
        let data = this.creationForm.controls[key].value;
        for (let i = 0; i < data.length; i++) formData.append(key, data[i]);
      }
      else if (key == 'birthdate') {
        const date = (this.creationForm.controls[key].value as Date).toDateString();
        formData.append(key, date);
      }
      else if (key == 'imageFile')
        formData.append(
           key,
          this.creationForm.controls[key].value,
          this.creationForm.controls[key].value.name
        );
      else formData.append(key, this.creationForm.controls[key].value);
    }
    if (id != 0)
      responce = (await lastValueFrom(this.stafService.update(formData))).status;
    else
      responce = (await lastValueFrom(this.stafService.create(formData))).status;
    if (responce == 200) this.router.navigate(['/staf-table']);
  }

  async loadPhoto(event: any) {
    const file:File = event.target.files[0];
    this.creationForm.controls['imageFile'].setValue(file);
    if (file)
      this.photo = await ImageProcessor.loadImageFromFile(file)
    else this.photo = this.staf.imageName;
  }
}
