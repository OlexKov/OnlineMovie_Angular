import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IStaf } from '../../models/IStaf';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';

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
    MatCheckboxModule
   ],
  templateUrl: './staf-add-edit.component.html',
  styleUrl: './staf-add-edit.component.css',
  providers:[provideNativeDateAdapter()]
})
export class StafAddEditComponent implements OnInit {
  staf:IStaf
  title:string
  creationForm: FormGroup;
  countries: ICountry[] | null;
  roles: IStafRole[] | null;
  movies: IMovie[] | null;
  photo:string
  constructor(private route:ActivatedRoute,
              private dataService:DataService,
              private movieService:MoviesService,
              private stafService:StafService,
              private fb: FormBuilder)
  {
    this.route.queryParams.subscribe((res)=>{
      this.staf = JSON.parse(res['stafItem']);
      this.title = res['title']
    })

    this.creationForm = this.fb.group({
      id: [this.staf.id],
      name: [
       this.staf.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z].*'),
        ],
      ],
      surname: [
        this.staf.surname,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z].*'),
        ],
      ],
      description: [
        this.staf.description,
        [
          Validators.required,
          Validators.minLength(30),
          Validators.maxLength(1024),
        ],
      ],
      image: [this.staf.imageName, [Validators.maxLength(1024)]],
      countryId:[null],
      birthdate: [this.staf.birthdate],
      isOscar: [this.staf.isOscar],
      movies: [null],
      roles: [null],
      file: [undefined],
    });
    this.photo = this.staf.imageName;
  }

 async ngOnInit(){
      let stafMovies = (await lastValueFrom(this.stafService.getmovies(this.staf.id))).body?.map(x=>x.id)
      let stafRoles = (await lastValueFrom(this.stafService.getroles(this.staf.id))).body?.map(x=>x.id)
      this.countries = (await lastValueFrom(this.dataService.getCountries())).body as Array<ICountry> ;
      this.roles = (await lastValueFrom( this.dataService.getRoles())).body as Array<IStafRole>;
      this.movies =(await lastValueFrom(this.movieService.getAll())).body as Array<IMovie>;
      this.creationForm.controls['countryId']?.setValue(this.staf.countryId);
      this.creationForm.controls['movies']?.setValue(stafMovies);
      this.creationForm.controls['roles']?.setValue(stafRoles);
  }

  saveStaf() {
    console.log(this.creationForm.value);
  }

}
